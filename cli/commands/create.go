package commands

import (
  "bytes"
  "fmt"
  "io"
  "net/http"
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

      resp, err := http.Post(*apiURL, "application/json", bytes.NewBuffer(data))
      if err != nil {
        fmt.Println("Error sending request:", err)
        return
      }
      defer resp.Body.Close()

      body, _ := io.ReadAll(resp.Body)
      fmt.Println(string(body))
    },
  }

  cmd.Flags().StringVarP(&filePath, "file", "f", "", "Path to bricks.json")
  cmd.MarkFlagRequired("file")
  return cmd
}
