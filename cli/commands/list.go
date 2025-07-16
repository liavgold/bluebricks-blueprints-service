package commands

import (
	"fmt"
	"io"
	"net/http"

	"github.com/spf13/cobra"
)

func ListCommand(apiURL *string) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list",
		Short: "List all blueprints",
		Run: func(cmd *cobra.Command, args []string) {
			resp, err := http.Get(*apiURL + "/blueprints")
			if err != nil {
				fmt.Println("Error sending request:", err)
				return
			}
			defer resp.Body.Close()

			body, _ := io.ReadAll(resp.Body)
			fmt.Println(string(body))
		},
	}
	return cmd
}
