package main

import (
	"fmt"
	"log"
	"os"
	"reflect"
	"slices"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "fresk-server/migrations"
	"fresk-server/types"
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

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

		return se.Next()
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// register "GET /hello/{name}" route (allowed for everyone)
		g := se.Router.Group("/api/v1")

		g.BindFunc(func(e *core.RequestEvent) error {
			// check if request is allowed
			var authHeader = e.Request.Header.Get("Authorization")
			if authHeader == "" {
				return e.BadRequestError("Authorization header is missing")
			}
			appId, appKey, err := parseAuthHeader(authHeader)
		})

	
		return se.Next()
	})




	// loosely check if it was executed using "go run"
    isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

    migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
        // enable auto creation of migration files when making collection changes in the Dashboard
        // (the isGoRun check is to enable it only during development)
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

