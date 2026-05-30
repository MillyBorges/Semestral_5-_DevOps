package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Produto struct {
	ID    int    `json:"id"`
	Nome  string `json:"nome"`
	Qtd   int    `json:"quantidade"`
}

func main() {
	http.HandleFunc("/estoque", func(w http.ResponseWriter, r *http.Request) {
		produtos := []Produto{
			{ID: 1, Nome: "Notebook", Qtd: 10},
			{ID: 2, Nome: "Mouse", Qtd: 50},
			{ID: 3, Nome: "Teclado", Qtd: 30},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(produtos)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, `{"status": "Estoque Service is running"}`)
	})

	fmt.Println("Estoque Service rodando na porta 8080")
	http.ListenAndServe(":8080", nil)
}
