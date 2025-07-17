package commands

import (
	"bluebricks-cli/utils"
	"fmt"

	"github.com/spf13/cobra"
)

func DeleteCommand(apiURL *string) *cobra.Command {
	var id string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a blueprint",
		Run: func(cmd *cobra.Command, args []string) {
			url := fmt.Sprintf("%s/blueprints/%s", *apiURL, id)

			resp, err := utils.SendRequest("DELETE", url, nil)
			if err != nil {
				fmt.Println("Error deleting blueprint:", err)
				return
			}

			fmt.Println("Blueprint deleted:")
			fmt.Println(string(resp))
		},
	}

	cmd.Flags().StringVarP(&id, "id", "i", "", "ID of the blueprint")
	cmd.MarkFlagRequired("id")

	return cmd
}
