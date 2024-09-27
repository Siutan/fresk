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

		collection, err := dao.FindCollectionByNameOrId("uhk1me1yym3nnvs")
		if err != nil {
			return err
		}

		// add
		new_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "iyvycyip",
			"name": "app",
			"type": "relation",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "tdm1gdjjw0wklav",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_app); err != nil {
			return err
		}
		collection.Schema.AddField(new_app)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("uhk1me1yym3nnvs")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("iyvycyip")

		return dao.SaveCollection(collection)
	})
}
