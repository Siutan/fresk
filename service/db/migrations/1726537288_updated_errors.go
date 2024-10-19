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

		// add
		new_build := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "u42omwvf",
			"name": "build",
			"type": "relation",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "nqbu3h92m1v9nw7",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_build); err != nil {
			return err
		}
		collection.Schema.AddField(new_build)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("mg732hm65cp6e3m")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("u42omwvf")

		return dao.SaveCollection(collection)
	})
}
