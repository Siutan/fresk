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

		// remove
		collection.Schema.RemoveField("ytbcopmg")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ez8p7tulxetlou7")
		if err != nil {
			return err
		}

		// add
		del_build := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ytbcopmg",
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
		}`), del_build); err != nil {
			return err
		}
		collection.Schema.AddField(del_build)

		return dao.SaveCollection(collection)
	})
}
