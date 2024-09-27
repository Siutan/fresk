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

		collection, err := dao.FindCollectionByNameOrId("7y7e7x44vowwax9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS group_app,\n    eg.log_type AS group_log_type,\n  eg.value AS group_log_value,\n  eg.assignee,\n  eg.note,\n  eg.created,\n    COUNT(el.id) AS log_count\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type;"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("ujkaidn8")

		// remove
		collection.Schema.RemoveField("9btsfesb")

		// remove
		collection.Schema.RemoveField("pcqkxgbf")

		// add
		new_group_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "kzvqo7kl",
			"name": "group_app",
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
		}`), new_group_app); err != nil {
			return err
		}
		collection.Schema.AddField(new_group_app)

		// add
		new_group_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ynourej3",
			"name": "group_log_type",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_group_log_type); err != nil {
			return err
		}
		collection.Schema.AddField(new_group_log_type)

		// add
		new_group_log_value := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "aj272efc",
			"name": "group_log_value",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_group_log_value); err != nil {
			return err
		}
		collection.Schema.AddField(new_group_log_value)

		// add
		new_assignee := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "m9fdgcuv",
			"name": "assignee",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_assignee); err != nil {
			return err
		}
		collection.Schema.AddField(new_assignee)

		// add
		new_note := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "viovozib",
			"name": "note",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_note); err != nil {
			return err
		}
		collection.Schema.AddField(new_note)

		// add
		new_log_count := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "63mue36r",
			"name": "log_count",
			"type": "number",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"noDecimal": false
			}
		}`), new_log_count); err != nil {
			return err
		}
		collection.Schema.AddField(new_log_count)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("7y7e7x44vowwax9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS group_app,\n    eg.log_type AS group_log_type,\n    COUNT(el.id) AS log_count\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type;"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// add
		del_group_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ujkaidn8",
			"name": "group_app",
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
		}`), del_group_app); err != nil {
			return err
		}
		collection.Schema.AddField(del_group_app)

		// add
		del_group_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "9btsfesb",
			"name": "group_log_type",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_group_log_type); err != nil {
			return err
		}
		collection.Schema.AddField(del_group_log_type)

		// add
		del_log_count := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "pcqkxgbf",
			"name": "log_count",
			"type": "number",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"noDecimal": false
			}
		}`), del_log_count); err != nil {
			return err
		}
		collection.Schema.AddField(del_log_count)

		// remove
		collection.Schema.RemoveField("kzvqo7kl")

		// remove
		collection.Schema.RemoveField("ynourej3")

		// remove
		collection.Schema.RemoveField("aj272efc")

		// remove
		collection.Schema.RemoveField("m9fdgcuv")

		// remove
		collection.Schema.RemoveField("viovozib")

		// remove
		collection.Schema.RemoveField("63mue36r")

		return dao.SaveCollection(collection)
	})
}
