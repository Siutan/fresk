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

		// add
		new_link := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "tw7vhmcg",
			"name": "link",
			"type": "url",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"exceptDomains": [],
				"onlyDomains": []
			}
		}`), new_link); err != nil {
			return err
		}
		collection.Schema.AddField(new_link)

		// add
		new_status := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "uops5eam",
			"name": "status",
			"type": "bool",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {}
		}`), new_status); err != nil {
			return err
		}
		collection.Schema.AddField(new_status)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("tdm1gdjjw0wklav")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("tw7vhmcg")

		// remove
		collection.Schema.RemoveField("uops5eam")

		return dao.SaveCollection(collection)
	})
}
