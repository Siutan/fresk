package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("mg732hm65cp6e3m")
		if err != nil {
			return err
		}

		if err := json.Unmarshal([]byte(`[
			"CREATE INDEX ` + "`" + `idx_TchmgbZ` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `session_email` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_8v5ZfC0` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `session_id` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_xW6jKlJ` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `time` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_ygLx6G3` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `log_type` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_UU4BFW6` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `network_type` + "`" + `)"
		]`), &collection.Indexes); err != nil {
			return err
		}

		// update
		edit_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "eykdm3ec",
			"name": "log_type",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_log_type); err != nil {
			return err
		}
		collection.Schema.AddField(edit_log_type)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("mg732hm65cp6e3m")
		if err != nil {
			return err
		}

		if err := json.Unmarshal([]byte(`[
			"CREATE INDEX ` + "`" + `idx_TchmgbZ` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `session_email` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_8v5ZfC0` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `session_id` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_xW6jKlJ` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `time` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_ygLx6G3` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `kind` + "`" + `)",
			"CREATE INDEX ` + "`" + `idx_UU4BFW6` + "`" + ` ON ` + "`" + `errors` + "`" + ` (` + "`" + `network_type` + "`" + `)"
		]`), &collection.Indexes); err != nil {
			return err
		}

		// update
		edit_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "eykdm3ec",
			"name": "kind",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), edit_log_type); err != nil {
			return err
		}
		collection.Schema.AddField(edit_log_type)

		return dao.SaveCollection(collection)
	})
}
