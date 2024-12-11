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
			"id": "tdm1gdjjw0wklav",
			"created": "2024-09-17 00:55:56.413Z",
			"updated": "2024-09-17 00:55:56.413Z",
			"name": "apps",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "n5fn4hb4",
					"name": "app_secret",
					"type": "text",
					"required": true,
					"presentable": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("tdm1gdjjw0wklav")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
