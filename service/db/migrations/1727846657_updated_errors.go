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

		// remove
		collection.Schema.RemoveField("mppu7qc2")

		// add
		new_stacktrace := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "c3fkmrv7",
			"name": "stacktrace",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 3000000
			}
		}`), new_stacktrace); err != nil {
			return err
		}
		collection.Schema.AddField(new_stacktrace)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("mg732hm65cp6e3m")
		if err != nil {
			return err
		}

		// add
		del_stacktrace := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "mppu7qc2",
			"name": "stacktrace",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_stacktrace); err != nil {
			return err
		}
		collection.Schema.AddField(del_stacktrace)

		// remove
		collection.Schema.RemoveField("c3fkmrv7")

		return dao.SaveCollection(collection)
	})
}
