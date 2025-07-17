package main

import (
	"bluebricks-cli/commands"
	"github.com/spf13/cobra"
)

func main() {
	var apiURL string

	rootCmd := &cobra.Command{
		Use:   "cli",
		Short: "Blueprints CLI for Bluebricks",
	}
	rootCmd.PersistentFlags().StringVar(&apiURL, "url", "http://localhost:3000", "API base URL")

	rootCmd.AddCommand(
		commands.CreateCommand(&apiURL),
		commands.GetCommand(&apiURL),
		commands.ListCommand(&apiURL),
		commands.UpdateCommand(&apiURL),
		commands.DeleteCommand(&apiURL),
	)

	rootCmd.Execute()
}
