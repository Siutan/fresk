package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"reflect"
	"slices"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"fresk-server/fingerprinting"
	_ "fresk-server/migrations"
	"fresk-server/types"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type sourceMapData struct {
	FileName string `json:"file_name"`
	BundleId string `json:"bundleId"`
	Map      *any   `json:"map"`
}

type bundleData struct {
	Version     string `json:"version"`
	Environment string `json:"environment"`
}

type Config struct {
	URL            string `json:"url"`
	allowedOrigins []string
}

var config Config

func init() {
	// load the config file
	file, err := os.Open("../configs/config.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// unmarshal the config file
	err = json.NewDecoder(file).Decode(&config)
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	app := pocketbase.New()

	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		return nil
	})

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Error Handling //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/error", func(c echo.Context) error {
			// Check for allowed origin
			origin := c.Request().Header.Get("Origin")
			if origin == "" {
				origin = c.Request().Header.Get("Referer")
			}

			// if there are no allowed origins, allow all
			if len(config.allowedOrigins) > 0 && !isAllowedURL(origin, config.allowedOrigins) {
				return c.JSON(http.StatusForbidden, map[string]string{"error": "origin not allowed"})
			}
			// check the request headers for the x_app_id and the x_app_key
			appId, appKey, err := parseAuthHeader(c.Request().Header.Get("Authorization"))
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Invalid authorization header: " + err.Error()})
			}

			if appId == "" || appKey == "" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// check if the app id and key match an app in the database
			appRecord, err := app.Dao().FindRecordById("apps", appId)
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// check if the key matches the one in the app record
			if appRecord.Get("app_key") != appKey {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// Check if the request body exists and the content type is JSON
			if c.Request().Body == nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Request body is empty"})
			}
			contentType := c.Request().Header.Get("Content-Type")
			if contentType != "application/json" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Content type is not JSON"})
			}

			reqBody := new(types.RequestBody)

			if err := c.Bind(reqBody); err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Invalid request body: " + err.Error()})
			}

			// Check for missing required fields
			missingFields := checkRequiredFields(*reqBody)
			if len(missingFields) > 0 {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{
					"status":         "error",
					"error":          "missing required fields",
					"missing_fields": missingFields,
				})
			}

			// fingerprint the error
			fingerprint := fingerprinting.GenerateFingerprint(reqBody)

			errorGroupID, err := fingerprinting.FindOrCreateErrorGroup(app, reqBody, fingerprint)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error processing error group: " + err.Error()})
			}

			// add the data to a record
			collection, err := app.Dao().FindCollectionByNameOrId("errors")
			if err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error finding collection: " + err.Error()})
			}

			record := models.NewRecord(collection)

			record.Set("app", reqBody.AppID)
			record.Set("bundle", reqBody.BundleID)
			record.Set("app_version", reqBody.AppVersion)
			record.Set("app_environment", reqBody.AppEnvironment)
			record.Set("session_id", reqBody.SessionID)
			record.Set("session_email", reqBody.SessionEmail)
			record.Set("device_type", reqBody.Platform)
			record.Set("browser_name", reqBody.BrowserName)
			record.Set("browser_version", reqBody.BrowserVersion)
			record.Set("os_name", reqBody.OsName)
			record.Set("os_version", reqBody.OsVersion)
			record.Set("log_type", reqBody.LogType)
			record.Set("page_id", reqBody.PageID)
			record.Set("page_url", reqBody.PageURL)
			record.Set("screen_resolution", reqBody.ScreenSize)
			record.Set("viewport_size", reqBody.ViewportSize)
			record.Set("memory_usage", reqBody.MemoryUsage)
			record.Set("network_type", reqBody.NetworkType)
			record.Set("language", reqBody.Language)
			record.Set("time_zone", reqBody.TimeZone)
			record.Set("referrer", reqBody.Referrer)
			record.Set("performance_metrics", reqBody.PerformanceMetrics)
			record.Set("sdk_version", reqBody.SDKVersion)
			record.Set("time", reqBody.Time)
			record.Set("value", reqBody.Value)
			record.Set("stacktrace", reqBody.Stacktrace)
			record.Set("custom", reqBody.Custom)
			record.Set("breadcrumbs", reqBody.Breadcrumbs)
			record.Set("error_group", errorGroupID)
			record.Set("fingerprint", fingerprint)

			if err := app.Dao().SaveRecord(record); err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error saving log: " + err.Error()})
			}

			return c.JSON(http.StatusOK, map[string]string{"status": "ok", "message": "Log with ID " + record.Id + " sent successfully"})
		})

		return nil
	})

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Bundle Handling //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/bundle", func(c echo.Context) error {
			// Check for allowed origin
			origin := c.Request().Header.Get("Origin")
			if origin == "" {
				origin = c.Request().Header.Get("Referer")
			}

			// if there are no allowed origins, allow all
			if len(config.allowedOrigins) > 0 && !isAllowedURL(origin, config.allowedOrigins) {
				return c.JSON(http.StatusForbidden, map[string]string{"error": "origin not allowed"})
			}
			// get appKey and appId from the authorization header. its in the format "Bearer appId:appKey"
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Authorization header is missing"})
			}

			appId, appKey, err := parseAuthHeader(authHeader)
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Invalid authorization header: " + err.Error()})
			}

			if appId == "" || appKey == "" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// check if the app id and key match an app in the database
			appRecord, err := app.Dao().FindRecordById("apps", appId)
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// check if the key matches the one in the app record
			if appRecord.Get("app_key") != appKey {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// Check if the request body exists and the content type is JSON
			if c.Request().Body == nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Request body is empty"})
			}
			contentType := c.Request().Header.Get("Content-Type")
			if contentType != "application/json" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Content type is not JSON"})
			}

			reqBody := new(bundleData)

			if err := c.Bind(reqBody); err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Invalid request body: " + err.Error()})
			}

			// create a new bundle with the provided version and environment
			collection, err := app.Dao().FindCollectionByNameOrId("bundles")
			if err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error finding collection: " + err.Error()})
			}

			record := models.NewRecord(collection)

			record.Set("app", appId)
			record.Set("version", reqBody.Version)
			record.Set("environment", reqBody.Environment)

			if err := app.Dao().SaveRecord(record); err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error saving bundle: " + err.Error()})
			}

			// return the bundle id
			return c.JSON(http.StatusOK, map[string]string{"status": "ok", "bundle_id": record.Id})
		})
		return nil
	})

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Source Map Handling //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/sourcemap", func(c echo.Context) error {
			// Check for allowed origin
			origin := c.Request().Header.Get("Origin")
			if origin == "" {
				origin = c.Request().Header.Get("Referer")
			}

			// if there are no allowed origins, allow all
			if len(config.allowedOrigins) > 0 && !isAllowedURL(origin, config.allowedOrigins) {
				return c.JSON(http.StatusForbidden, map[string]string{"error": "origin not allowed"})
			}
			// check the request headers for the x_app_id and the x_app_key
			appId, appKey, err := parseAuthHeader(c.Request().Header.Get("Authorization"))
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Invalid authorization header: " + err.Error()})
			}

			// check if the app id and key match an app in the database
			appRecord, err := app.Dao().FindRecordById("apps", appId)
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// check if the key matches the one in the app record
			if appRecord.Get("app_key") != appKey {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid credentials"})
			}

			// Check if the request body exists and the content type is JSON
			if c.Request().Body == nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Request body is empty"})
			}
			contentType := c.Request().Header.Get("Content-Type")
			if contentType != "application/json" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Content type is not JSON"})
			}

			reqBody := new(sourceMapData)
			println(reqBody)

			if err := c.Bind(reqBody); err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Invalid request body: " + err.Error()})
			}

			// Check if map is empty
			if reqBody.Map == nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "source map is empty"})
			}

			// add the data to a record
			collection, err := app.Dao().FindCollectionByNameOrId("sourcemaps")
			if err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error finding collection: " + err.Error()})
			}

			record := models.NewRecord(collection)

			record.Set("app", appId)
			record.Set("bundle", reqBody.BundleId)
			record.Set("file_name", reqBody.FileName)
			record.Set("map", reqBody.Map)

			if err := app.Dao().SaveRecord(record); err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"status": "error", "message": "Error saving source map: " + err.Error()})
			}

			return c.JSON(http.StatusOK, map[string]string{"status": "ok", "build_id": record.Id, "file_name": reqBody.FileName})
		})
		return nil
	})

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Recording Handling //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/record", func(c echo.Context) error {
			// Check for allowed origin
			origin := c.Request().Header.Get("Origin")
			if origin == "" {
				origin = c.Request().Header.Get("Referer")
			}

			// if there are no allowed origins, allow all
			if len(config.allowedOrigins) > 0 && !isAllowedURL(origin, config.allowedOrigins) {
				return c.JSON(http.StatusForbidden, map[string]string{"error": "origin not allowed"})
			}
			// check the request headers for the x_app_id and the x_app_key
			appId := c.Request().Header.Get("X-App-Id")
			appKey := c.Request().Header.Get("X-App-Key")

			if appId == "" || appKey == "" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "no app_id or app_key provided"})
			}

			// check if the app id and key match an app in the database
			appRecord, err := app.Dao().FindRecordById("apps", appId)
			if err != nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid app_id"})
			}

			// check if the key matches the one in the app record
			if appRecord.Get("app_key") != appKey {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "invalid app_key"})
			}

			// Check if the request body exists and the content type is JSON
			if c.Request().Body == nil {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Request body is empty"})
			}
			contentType := c.Request().Header.Get("Content-Type")
			if contentType != "application/json" {
				return c.JSON(http.StatusBadRequest, map[string]string{"status": "error", "message": "Content type is not JSON"})
			}

			return c.JSON(http.StatusOK, map[string]string{"status": "ok", "message": "Recording started successfully"})

		})

		return nil
	})

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// User Management //
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	app.OnRecordBeforeCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
		if admin != nil {
			return nil // ignore for admins
		}

		// check if the user is the first user
		// if this is the first user, set the user as "admin"
		// else set them as "member"
		records, err := FindAllUsers(app.Dao())
		if err != nil {
			return err
		}
		log.Println(records)

		if len(records) == 0 {
			e.Record.Set("access_level", "2")
			return nil
		}

		e.Record.Set("access_level", "1")

		// set email visibility
		e.Record.Set("email_visibility", true)

		return nil
	})

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func parseAuthHeader(authHeader string) (string, string, error) {
	// split the header into parts
	parts := strings.Split(authHeader, " ")

	if len(parts) != 2 {
		return "", "", fmt.Errorf("invalid authorization header format")
	}

	// split the appId and appKey
	credentials := strings.Split(parts[1], ":")
	if len(credentials) != 2 {
		return "", "", fmt.Errorf("invalid credentials format")
	}
	appId := credentials[0]
	appKey := credentials[1]

	return appId, appKey, nil
}

func FindAllUsers(dao *daos.Dao) ([]*models.Record, error) {
	query := dao.RecordQuery("users")

	records := []*models.Record{}
	if err := query.All(&records); err != nil {
		return nil, err
	}

	return records, nil
}

// checkRequiredFields checks if the required fields are present in the requestBody struct.
func checkRequiredFields(reqBody types.RequestBody) []string {
	var missingFields []string
	var optionalFields []string = []string{"session_email", "referrer", "performance_metrics", "memory_usage", "custom", "stacktrace", "bundle", "bundle_id"}

	v := reflect.ValueOf(reqBody)
	typeOfS := v.Type()

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		tag := typeOfS.Field(i).Tag.Get("json")

		if slices.Contains(optionalFields, tag) {
			continue
		}

		// Only check fields marked as required
		if !field.IsValid() || isEmptyValue(field) {
			if tag != "" {
				missingFields = append(missingFields, tag)
			}
		}
	}

	return missingFields
}

// isEmptyValue checks if a field value is empty.
func isEmptyValue(v reflect.Value) bool {
	switch v.Kind() {
	case reflect.String, reflect.Array:
		return v.Len() == 0
	case reflect.Bool:
		return false // No boolean field is required, so it's always considered present
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return v.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return v.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return v.Float() == 0
	case reflect.Interface, reflect.Ptr:
		return v.IsNil()
	}
	return reflect.DeepEqual(v.Interface(), reflect.Zero(v.Type()).Interface())
}

func isAllowedURL(origin string, allowedURLs []string) bool {
	for _, allowedURL := range allowedURLs {
		if origin == allowedURL {
			return true
		}
	}
	return false
}
