package main

import (
  "bluebricks-cli/commands"
  "github.com/spf13/cobra"
)

func main() {
  rootCmd := &cobra.Command{Use: "cli"}

  apiURL := "http://localhost:3000"
  rootCmd.AddCommand(
    commands.CreateCommand(&apiURL),
    commands.GetCommand(&apiURL),
    commands.ListCommand(&apiURL),
    commands.UpdateCommand(&apiURL),
    commands.DeleteCommand(&apiURL),
  )

  rootCmd.Execute()
}
