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

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update
		edit_access_level := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "kmih8krl",
			"name": "access_level",
			"type": "select",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"0",
					"1",
					"2"
				]
			}
		}`), edit_access_level); err != nil {
			return err
		}
		collection.Schema.AddField(edit_access_level)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update
		edit_access_level := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "kmih8krl",
			"name": "access_level",
			"type": "select",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"values": [
					"0",
					"1. 2"
				]
			}
		}`), edit_access_level); err != nil {
			return err
		}
		collection.Schema.AddField(edit_access_level)

		return dao.SaveCollection(collection)
	})
}
