package commands

import (
	"bluebricks-cli/utils"
	"fmt"

	"github.com/spf13/cobra"
)

func GetCommand(apiURL *string) *cobra.Command {
	var id string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a blueprint by ID",
		Run: func(cmd *cobra.Command, args []string) {
			url := fmt.Sprintf("%s/blueprints/%s", *apiURL, id)

			resp, err := utils.SendRequest("GET", url, nil)
			if err != nil {
				fmt.Println("Error retrieving blueprint:", err)
				return
			}

			fmt.Println("Blueprint details:")
			fmt.Println(string(resp))
		},
	}

	cmd.Flags().StringVarP(&id, "id", "i", "", "ID of the blueprint")
	cmd.MarkFlagRequired("id")

	return cmd
}
