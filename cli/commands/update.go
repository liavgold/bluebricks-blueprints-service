package commands

import (
	"bluebricks-cli/utils"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func UpdateCommand(apiURL *string) *cobra.Command {
	var id string
	var filePath string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a blueprint",
		Run: func(cmd *cobra.Command, args []string) {
			data, err := os.ReadFile(filePath)
			if err != nil {
				fmt.Println("Error reading file:", err)
				return
			}

			url := fmt.Sprintf("%s/blueprints/%s", *apiURL, id)
			resp, err := utils.SendRequest("PUT", url, data)
			if err != nil {
				fmt.Println("Error updating blueprint:", err)
				return
			}

			fmt.Println("✅ Blueprint updated:")
			fmt.Println(string(resp))
		},
	}

	cmd.Flags().StringVarP(&id, "id", "i", "", "ID of the blueprint")
	cmd.Flags().StringVarP(&filePath, "file", "f", "", "Path to updated blueprint JSON")
	cmd.MarkFlagRequired("id")
	cmd.MarkFlagRequired("file")

	return cmd
}
