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
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS group_app,\n    eg.log_type AS group_log_type,\n    eg.value AS group_log_value,\n    eg.assignee,\n    eg.note,\n    COUNT(el.id) AS log_count,\n  (\n        SELECT \n            MIN(el2.created)\n        FROM \n            errors el2\n        WHERE \n            el2.error_group = eg.id\n    ) AS first_error_created,\n    (\n        SELECT \n            MAX(el2.created)\n        FROM \n            errors el2\n        WHERE \n            el2.error_group = eg.id\n    ) AS latest_error_created\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type, eg.value, eg.assignee, eg.note;\n"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("nmdm8nj6")

		// remove
		collection.Schema.RemoveField("79fnm4tl")

		// remove
		collection.Schema.RemoveField("mxkvbogd")

		// remove
		collection.Schema.RemoveField("cfiwj2ci")

		// remove
		collection.Schema.RemoveField("rxy7cqrw")

		// remove
		collection.Schema.RemoveField("mqdpyqfl")

		// remove
		collection.Schema.RemoveField("iyb4fdga")

		// add
		new_group_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uyrm1w2x",
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
			"id": "fi5nchpf",
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
			"id": "yoa7ahss",
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
			"id": "vpcxmbik",
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
			"id": "kjt2fzts",
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
			"id": "mhxnwtbv",
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

		// add
		new_first_error_created := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "g1xjunkv",
			"name": "first_error_created",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_first_error_created); err != nil {
			return err
		}
		collection.Schema.AddField(new_first_error_created)

		// add
		new_latest_error_created := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ctshvuzv",
			"name": "latest_error_created",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_latest_error_created); err != nil {
			return err
		}
		collection.Schema.AddField(new_latest_error_created)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("7y7e7x44vowwax9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS group_app,\n    eg.log_type AS group_log_type,\n    eg.value AS group_log_value,\n    eg.assignee,\n    eg.note,\n    COUNT(el.id) AS log_count,\n    (\n        SELECT \n            MAX(el2.created)\n        FROM \n            errors el2\n        WHERE \n            el2.error_group = eg.id\n    ) AS latest_error_created\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type, eg.value, eg.assignee, eg.note;\n"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// add
		del_group_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "nmdm8nj6",
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
			"id": "79fnm4tl",
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
		del_group_log_value := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "mxkvbogd",
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
		}`), del_group_log_value); err != nil {
			return err
		}
		collection.Schema.AddField(del_group_log_value)

		// add
		del_assignee := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "cfiwj2ci",
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
		}`), del_assignee); err != nil {
			return err
		}
		collection.Schema.AddField(del_assignee)

		// add
		del_note := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "rxy7cqrw",
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
		}`), del_note); err != nil {
			return err
		}
		collection.Schema.AddField(del_note)

		// add
		del_log_count := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "mqdpyqfl",
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

		// add
		del_latest_error_created := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "iyb4fdga",
			"name": "latest_error_created",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), del_latest_error_created); err != nil {
			return err
		}
		collection.Schema.AddField(del_latest_error_created)

		// remove
		collection.Schema.RemoveField("uyrm1w2x")

		// remove
		collection.Schema.RemoveField("fi5nchpf")

		// remove
		collection.Schema.RemoveField("yoa7ahss")

		// remove
		collection.Schema.RemoveField("vpcxmbik")

		// remove
		collection.Schema.RemoveField("kjt2fzts")

		// remove
		collection.Schema.RemoveField("mhxnwtbv")

		// remove
		collection.Schema.RemoveField("g1xjunkv")

		// remove
		collection.Schema.RemoveField("ctshvuzv")

		return dao.SaveCollection(collection)
	})
}
