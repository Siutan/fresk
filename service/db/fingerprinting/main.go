package fingerprinting

import (
	"crypto/sha256"
	"encoding/hex"
	"fresk-server/types"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/models"
)

func GenerateFingerprint(reqBody *types.RequestBody) string {
	// Combine relevant fields for fingerprinting
	fingerprintParts := []string{
		reqBody.LogType,
		reqBody.Value,
	}

	// Add top 5 frames of stacktrace if available
	if reqBody.Stacktrace != "" {
		frames := strings.Split(reqBody.Stacktrace, "\n")
		for i := 0; i < min(5, len(frames)); i++ {
			fingerprintParts = append(fingerprintParts, frames[i])
		}
	}

	// Generate hash
	h := sha256.New()
	h.Write([]byte(strings.Join(fingerprintParts, "|")))
	return hex.EncodeToString(h.Sum(nil))
}

func FindOrCreateErrorGroup(app *pocketbase.PocketBase, reqBody *types.RequestBody, fingerprint string) (string, error) {
    // Try to find existing error group
    errorGroups, err := app.Dao().FindRecordsByExpr("error_groups",
        dbx.HashExp{
            "app": reqBody.AppID,
            "log_type": reqBody.LogType,
            "value": reqBody.Value,
        },
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
    newGroup.Set("value", reqBody.Value)

    if err := app.Dao().SaveRecord(newGroup); err != nil {
        return "", err
    }

    return newGroup.Id, nil
}