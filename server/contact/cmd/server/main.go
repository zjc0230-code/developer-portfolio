package main

import (
	"log"
	"net/http"
	"os"

	"github.com/jaycezhou/developer-portfolio/server/contact/internal/handler"
)

func main() {
	addr := envOr("ADDR", ":8083")
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", handler.Health)

	log.Printf("contact listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
