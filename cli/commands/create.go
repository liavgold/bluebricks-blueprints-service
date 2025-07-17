package commands

import (
	"bluebricks-cli/utils"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func CreateCommand(apiURL *string) *cobra.Command {
	var filePath string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new blueprint",
		Run: func(cmd *cobra.Command, args []string) {
			data, err := os.ReadFile(filePath)
			if err != nil {
				fmt.Println("Error reading file:", err)
				return
			}

			resp, err := utils.SendRequest("POST", *apiURL+"/blueprints", data)
			if err != nil {
				fmt.Println("Error creating blueprint:", err)
				return
			}

			fmt.Println("Blueprint created:")
			fmt.Println(string(resp))
		},
	}

	cmd.Flags().StringVarP(&filePath, "file", "f", "", "Path to bricks.json")
	cmd.MarkFlagRequired("file")

	return cmd
}
