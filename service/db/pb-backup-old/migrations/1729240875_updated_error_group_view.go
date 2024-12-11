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
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS app,\n    eg.log_type AS log_type,\n    eg.value AS log_value,\n    eg.assignee,\n    eg.note,\n    COUNT(el.id) AS log_count,\n    MIN(el.created) AS first_seen,\n    MAX(el.created) AS latest_seen\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type, eg.value, eg.assignee, eg.note;\n"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("2g3fxyww")

		// remove
		collection.Schema.RemoveField("yov2queh")

		// remove
		collection.Schema.RemoveField("evo4djzf")

		// remove
		collection.Schema.RemoveField("4ifbb6vx")

		// remove
		collection.Schema.RemoveField("rqwvxkc0")

		// remove
		collection.Schema.RemoveField("octn0ren")

		// remove
		collection.Schema.RemoveField("idrvj08y")

		// remove
		collection.Schema.RemoveField("1ci6zbgk")

		// add
		new_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "fykwlfbw",
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

		// add
		new_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "kajw1jub",
			"name": "log_type",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_log_type); err != nil {
			return err
		}
		collection.Schema.AddField(new_log_type)

		// add
		new_log_value := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "hf0vnzga",
			"name": "log_value",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_log_value); err != nil {
			return err
		}
		collection.Schema.AddField(new_log_value)

		// add
		new_assignee := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "opwr3q1p",
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
			"id": "yb8dqnic",
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
			"id": "broyy97c",
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
		new_first_seen := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "9yphouvs",
			"name": "first_seen",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_first_seen); err != nil {
			return err
		}
		collection.Schema.AddField(new_first_seen)

		// add
		new_latest_seen := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ahrubyas",
			"name": "latest_seen",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_latest_seen); err != nil {
			return err
		}
		collection.Schema.AddField(new_latest_seen)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("7y7e7x44vowwax9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS app,\n    eg.log_type AS group_log_type,\n    eg.value AS group_log_value,\n    eg.assignee,\n    eg.note,\n    COUNT(el.id) AS log_count,\n    MIN(el.created) AS first_seen,\n    MAX(el.created) AS latest_seen\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type, eg.value, eg.assignee, eg.note;\n"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// add
		del_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "2g3fxyww",
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
		}`), del_app); err != nil {
			return err
		}
		collection.Schema.AddField(del_app)

		// add
		del_group_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "yov2queh",
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
			"id": "evo4djzf",
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
			"id": "4ifbb6vx",
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
			"id": "rqwvxkc0",
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
			"id": "octn0ren",
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
		del_first_seen := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "idrvj08y",
			"name": "first_seen",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), del_first_seen); err != nil {
			return err
		}
		collection.Schema.AddField(del_first_seen)

		// add
		del_latest_seen := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "1ci6zbgk",
			"name": "latest_seen",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), del_latest_seen); err != nil {
			return err
		}
		collection.Schema.AddField(del_latest_seen)

		// remove
		collection.Schema.RemoveField("fykwlfbw")

		// remove
		collection.Schema.RemoveField("kajw1jub")

		// remove
		collection.Schema.RemoveField("hf0vnzga")

		// remove
		collection.Schema.RemoveField("opwr3q1p")

		// remove
		collection.Schema.RemoveField("yb8dqnic")

		// remove
		collection.Schema.RemoveField("broyy97c")

		// remove
		collection.Schema.RemoveField("9yphouvs")

		// remove
		collection.Schema.RemoveField("ahrubyas")

		return dao.SaveCollection(collection)
	})
}
