package migrations

import (
	"encoding/json"
	"os"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		integrationsFile, err := os.Open("../configs/integrations/list.json")
		if err != nil {
			return err
		}
		defer integrationsFile.Close()

		var integrations struct {
			Integrations []struct {
				Name        string      `json:"name"`
				Description string      `json:"description"`
				MetaData    interface{} `json:"meta_data"`
			} `json:"integrations"`
		}

		err = json.NewDecoder(integrationsFile).Decode(&integrations)
		if err != nil {
			return err
		}

		collection, err := dao.FindCollectionByNameOrId("integrations")
		if err != nil {
			return err
		}

		for _, integration := range integrations.Integrations {
			record := models.NewRecord(collection)
			record.Set("service_name", integration.Name)
			record.Set("meta_data", integration.MetaData)
			record.Set("active", false)
			if err := dao.SaveRecord(record); err != nil {
				return err
			}
		}

		return nil
	}, func(db dbx.Builder) error {
		// // clear integrations
		// dao := daos.New(db)

		// allRecords, err := 
		// if err != nil {
		// 	return err
		// }

		// for _, record := range allRecords {
		// 	if err := dao.DeleteRecord(record); err != nil {
		// 		return err
		// 	}
		// }

		return nil
	})
}
