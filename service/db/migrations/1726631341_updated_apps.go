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

		// update
		edit_active := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uops5eam",
			"name": "active",
			"type": "bool",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {}
		}`), edit_active); err != nil {
			return err
		}
		collection.Schema.AddField(edit_active)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("tdm1gdjjw0wklav")
		if err != nil {
			return err
		}

		// update
		edit_active := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uops5eam",
			"name": "status",
			"type": "bool",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {}
		}`), edit_active); err != nil {
			return err
		}
		collection.Schema.AddField(edit_active)

		return dao.SaveCollection(collection)
	})
}
