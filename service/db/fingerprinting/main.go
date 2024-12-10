package fingerprinting

import (
	"crypto/sha256"
	"encoding/hex"
	"fresk-server/types"
	"regexp"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

type ErrorGroup struct {
	Id      string `db:"id"`
	App     string `db:"app"`
	LogType string `db:"log_type"`
	Value   string `db:"value"`
}

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
	errorGroup := ErrorGroup{}
	err := app.DB().NewQuery(`
	SELECT id, app, log_type, value
	FROM error_groups
	WHERE app = {:app} AND log_type = {:log_type} AND LOWER(TRIM(value)) LIKE {:normalized_value}
	LIMIT 1
`).Bind(dbx.Params{
		"app":              reqBody.AppID,
		"log_type":         reqBody.LogType,
		"normalized_value": "%" + normalizedValue + "%",
	}).One(&errorGroup)

	if err != nil {
		return "", err
	}

	// If not, create a new error group
	collection, err := app.FindCollectionByNameOrId("error_groups")
	if err != nil {
		return "", err
	}

	newGroup := core.NewRecord(collection)
	newGroup.Set("app", reqBody.AppID)
	newGroup.Set("log_type", reqBody.LogType)
	newGroup.Set("value", normalizedValue) // Store the normalized value

	if err := app.Save(newGroup)
	err != nil {
		return "", err
	}

	return newGroup.Id, nil
}
