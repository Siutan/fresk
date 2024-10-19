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

		collection, err := dao.FindCollectionByNameOrId("tdm1gdjjw0wklav")
		if err != nil {
			return err
		}

		// add
		new_app_name := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "zofvuejq",
			"name": "app_name",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_app_name); err != nil {
			return err
		}
		collection.Schema.AddField(new_app_name)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("tdm1gdjjw0wklav")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("zofvuejq")

		return dao.SaveCollection(collection)
	})
}
