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

		collection, err := dao.FindCollectionByNameOrId("ez8p7tulxetlou7")
		if err != nil {
			return err
		}

		// add
		new_bundle := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "zu0mmcc0",
			"name": "bundle",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "gdb2r7idzedr5hu",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_bundle); err != nil {
			return err
		}
		collection.Schema.AddField(new_bundle)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ez8p7tulxetlou7")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("zu0mmcc0")

		return dao.SaveCollection(collection)
	})
}
