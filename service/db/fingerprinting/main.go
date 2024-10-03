package fingerprinting

import (
	"crypto/sha256"
	"encoding/hex"
	"fresk-server/types"
	"regexp"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func GenerateFingerprint(reqBody *types.RequestBody) string {
	// Combine relevant fields for fingerprinting
	fingerprintParts := []string{
		reqBody.LogType,
		normalizeErrorMessage(reqBody.Value),
	}

	// Add top 5 frames of stacktrace if available and not empty
	if stacktrace, ok := reqBody.Stacktrace.([]types.StackFrame); ok && len(stacktrace) > 0 {
		for i := 0; i < min(5, len(stacktrace)); i++ {
			frame := stacktrace[i]
			fingerprintParts = append(fingerprintParts, frame.Function, frame.File, string(frame.Line), string(frame.Col))
		}
	}

	// Generate hash
	h := sha256.New()
	h.Write([]byte(strings.Join(fingerprintParts, "|")))
	return hex.EncodeToString(h.Sum(nil))
}

func normalizeErrorMessage(message string) string {
	// Remove common prefixes like "Uncaught Error: " or "Error: "
	message = regexp.MustCompile(`^(Uncaught\s+)?(Error|TypeError|ReferenceError|SyntaxError):\s+`).ReplaceAllString(message, "")

	// Trim whitespace
	return strings.TrimSpace(message)
}

func FindOrCreateErrorGroup(app *pocketbase.PocketBase, reqBody *types.RequestBody, fingerprint string) (string, error) {
	// Normalize the error value
	normalizedValue := normalizeErrorMessage(reqBody.Value)

	// Try to find existing error group
	errorGroups, err := app.Dao().FindRecordsByExpr("error_groups",
		dbx.And(
			dbx.HashExp{"app": reqBody.AppID},
			dbx.HashExp{"log_type": reqBody.LogType},
			dbx.NewExp("LOWER(TRIM(value)) LIKE {:normalized_value}", dbx.Params{"normalized_value": "%" + normalizedValue + "%"}),
		),
	)
	if err != nil {
		return "", err
	}

	// If error group exists, return its ID
	if len(errorGroups) > 0 {
		return errorGroups[0].Id, nil
	}

	// If not, create a new error group
	collection, err := app.Dao().FindCollectionByNameOrId("error_groups")
	if err != nil {
		return "", err
	}

	newGroup := models.NewRecord(collection)
	newGroup.Set("app", reqBody.AppID)
	newGroup.Set("log_type", reqBody.LogType)
	newGroup.Set("value", normalizedValue) // Store the normalized value

	if err := app.Dao().SaveRecord(newGroup); err != nil {
		return "", err
	}

	return newGroup.Id, nil
}
