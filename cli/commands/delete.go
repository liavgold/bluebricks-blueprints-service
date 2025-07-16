package commands

import (
	"fmt"
	"io"
	"net/http"

	"github.com/spf13/cobra"
)

func DeleteCommand(apiURL *string) *cobra.Command {
	var id string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a blueprint by ID",
		Run: func(cmd *cobra.Command, args []string) {
			client := &http.Client{}
			req, err := http.NewRequest(http.MethodDelete, *apiURL+"/blueprints/"+id, nil)
			if err != nil {
				fmt.Println("Error creating request:", err)
				return
			}

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
	cmd.MarkFlagRequired("id")
	return cmd
}
