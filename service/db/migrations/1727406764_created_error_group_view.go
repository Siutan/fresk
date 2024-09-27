package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "7y7e7x44vowwax9",
			"created": "2024-09-27 03:12:44.957Z",
			"updated": "2024-09-27 03:12:44.957Z",
			"name": "error_group_view",
			"type": "view",
			"system": false,
			"schema": [
				{
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
				},
				{
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
				},
				{
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
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {
				"query": "SELECT\n    eg.id AS id,\n    eg.app AS group_app,\n    eg.log_type AS group_log_type,\n    COUNT(el.id) AS log_count\nFROM\n    error_groups eg\nJOIN\n    errors el ON el.error_group = eg.id\nGROUP BY\n    eg.id, eg.app, eg.log_type;"
			}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("7y7e7x44vowwax9")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
