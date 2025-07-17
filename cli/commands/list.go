package commands

import (
	"bluebricks-cli/utils"
	"fmt"

	"github.com/spf13/cobra"
)

func ListCommand(apiURL *string) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list",
		Short: "List all blueprints",
		Run: func(cmd *cobra.Command, args []string) {
			url := fmt.Sprintf("%s/blueprints", *apiURL)

			resp, err := utils.SendRequest("GET", url, nil)
			if err != nil {
				fmt.Println("Error listing blueprints:", err)
				return
			}

			fmt.Println("All Blueprints:")
			fmt.Println(string(resp))
		},
	}

	return cmd
}
