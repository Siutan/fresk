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

		collection, err := dao.FindCollectionByNameOrId("nqbu3h92m1v9nw7")
		if err != nil {
			return err
		}

		// add
		new_app_version := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "rothv4ir",
			"name": "app_version",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_app_version); err != nil {
			return err
		}
		collection.Schema.AddField(new_app_version)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("nqbu3h92m1v9nw7")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("rothv4ir")

		return dao.SaveCollection(collection)
	})
}
