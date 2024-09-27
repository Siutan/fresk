package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("uhk1me1yym3nnvs")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("@request.auth.id != \"\" && @request.auth.access_level > 1")

		collection.ViewRule = types.Pointer("@request.auth.id != \"\" && @request.auth.access_level > 1")

		collection.UpdateRule = types.Pointer("@request.auth.id != \"\" && @request.auth.access_level > 1")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("uhk1me1yym3nnvs")
		if err != nil {
			return err
		}

		collection.ListRule = nil

		collection.ViewRule = nil

		collection.UpdateRule = nil

		return dao.SaveCollection(collection)
	})
}
