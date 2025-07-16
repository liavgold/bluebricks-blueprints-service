package commands

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
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

			client := &http.Client{}
			req, err := http.NewRequest(http.MethodPut, *apiURL+"/blueprints/"+id, bytes.NewBuffer(data))
			if err != nil {
				fmt.Println("Error creating request:", err)
				return
			}
			req.Header.Set("Content-Type", "application/json")

			resp, err := client.Do(req)
			if err != nil {
				fmt.Println("Error sending request:", err)
				return
			}
			defer resp.Body.Close()

			body, _ := io.ReadAll(resp.Body)
			fmt.Println(string(body))
		},
	}

	cmd.Flags().StringVarP(&id, "id", "i", "", "Blueprint ID")
	cmd.Flags().StringVarP(&filePath, "file", "f", "", "Path to updated blueprint JSON file")
	cmd.MarkFlagRequired("id")
	cmd.MarkFlagRequired("file")
	return cmd
}
