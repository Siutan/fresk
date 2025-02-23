package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("mg732hm65cp6e3m")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(17, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text409167736",
			"max": 0,
			"min": 0,
			"name": "posthog_session",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("mg732hm65cp6e3m")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("text409167736")

		return app.Save(collection)
	})
}
