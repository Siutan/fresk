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
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS app,\n    eg.log_type AS log_type,\n    eg.value AS value,\n    eg.assignee,\n    eg.note,\n    COUNT(el.id) AS log_count,\n    MIN(el.created) AS first_seen,\n    MAX(el.created) AS last_seen,\n    (\n        SELECT COUNT(*)\n        FROM errors el2\n        WHERE el2.error_group = eg.id\n        AND el2.created >= datetime('now', '-1 day')\n    ) AS last_24h_count\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type, eg.value, eg.assignee, eg.note;\n"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// remove
		collection.Schema.RemoveField("qp0k6m2b")

		// remove
		collection.Schema.RemoveField("w27ixvmh")

		// remove
		collection.Schema.RemoveField("3wuoss72")

		// remove
		collection.Schema.RemoveField("woxo2nxm")

		// remove
		collection.Schema.RemoveField("r3w4lcvu")

		// remove
		collection.Schema.RemoveField("ywziau1q")

		// remove
		collection.Schema.RemoveField("grep4aos")

		// remove
		collection.Schema.RemoveField("fwz0h0ob")

		// add
		new_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "lgb67ng4",
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
			"id": "oxgnoxzx",
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
		new_value := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "wwhxqopi",
			"name": "value",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_value); err != nil {
			return err
		}
		collection.Schema.AddField(new_value)

		// add
		new_assignee := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "rjmncnqr",
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
			"id": "rwyenpde",
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
			"id": "ee0w6yhs",
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
			"id": "kwjw1jpe",
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
		new_last_seen := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "m9atyyb0",
			"name": "last_seen",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_last_seen); err != nil {
			return err
		}
		collection.Schema.AddField(new_last_seen)

		// add
		new_last_24h_count := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "rhr5cr9c",
			"name": "last_24h_count",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), new_last_24h_count); err != nil {
			return err
		}
		collection.Schema.AddField(new_last_24h_count)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("7y7e7x44vowwax9")
		if err != nil {
			return err
		}

		options := map[string]any{}
		if err := json.Unmarshal([]byte(`{
			"query": "SELECT\n    eg.id AS id,\n    eg.app AS app,\n    eg.log_type AS log_type,\n    eg.value AS value,\n    eg.assignee,\n    eg.note,\n    COUNT(el.id) AS log_count,\n    MIN(el.created) AS first_seen,\n    MAX(el.created) AS last_seen\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type, eg.value, eg.assignee, eg.note;\n"
		}`), &options); err != nil {
			return err
		}
		collection.SetOptions(options)

		// add
		del_app := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "qp0k6m2b",
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
		del_log_type := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "w27ixvmh",
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
		}`), del_log_type); err != nil {
			return err
		}
		collection.Schema.AddField(del_log_type)

		// add
		del_value := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "3wuoss72",
			"name": "value",
			"type": "text",
			"required": true,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), del_value); err != nil {
			return err
		}
		collection.Schema.AddField(del_value)

		// add
		del_assignee := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "woxo2nxm",
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
			"id": "r3w4lcvu",
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
			"id": "ywziau1q",
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
			"id": "grep4aos",
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
		del_last_seen := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "fwz0h0ob",
			"name": "last_seen",
			"type": "json",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"maxSize": 1
			}
		}`), del_last_seen); err != nil {
			return err
		}
		collection.Schema.AddField(del_last_seen)

		// remove
		collection.Schema.RemoveField("lgb67ng4")

		// remove
		collection.Schema.RemoveField("oxgnoxzx")

		// remove
		collection.Schema.RemoveField("wwhxqopi")

		// remove
		collection.Schema.RemoveField("rjmncnqr")

		// remove
		collection.Schema.RemoveField("rwyenpde")

		// remove
		collection.Schema.RemoveField("ee0w6yhs")

		// remove
		collection.Schema.RemoveField("kwjw1jpe")

		// remove
		collection.Schema.RemoveField("m9atyyb0")

		// remove
		collection.Schema.RemoveField("rhr5cr9c")

		return dao.SaveCollection(collection)
	})
}
