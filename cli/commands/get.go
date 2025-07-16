package commands

import (
	"fmt"
	"io"
	"net/http"

	"github.com/spf13/cobra"
)

func GetCommand(apiURL *string) *cobra.Command {
	var id string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Retrieve a blueprint by ID",
		Run: func(cmd *cobra.Command, args []string) {
			resp, err := http.Get(*apiURL + "/blueprints/" + id)
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
