package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/mikebway/knative-poc/grpc-ping/ping"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

const (
	DEFAULT_PORT     = "8080"
	AUTH_HEADER_NAME = "x-extauth-authorization"
)

var (
	// requestCount tracks the number of requests received
	requestCount int

	// gRPC client for the Ping service
	pingClient ping.PingServiceClient
)

// main is the command line entry point to the application.
func main() {

	// Route request for the root URL path and everything else under it
	http.HandleFunc("/", handleRoot)

	// Establish  gRPC client connection to the Ping service
	err := initPingClient()
	if err != nil {
		log.Fatalf("failed to establish connection to Ping service: %v", err)
	}

	// What port should we listen on
	port := os.Getenv("PORT")
	if port == "" {
		port = DEFAULT_PORT
		fmt.Printf("Defaulting to port %s\n", port)
	}

	// Start the server
	log.Printf("starting server at %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// handleRoot is the primary HTTP request handler for the root path and everything under it for this very crude website.
func handleRoot(w http.ResponseWriter, r *http.Request) {

	// Bump the count of requests seen
	requestCount++

	// Log the URL that we have been asked for etc
	log.Printf("handling request = %s, request count = %d\n", r.URL.Path, requestCount)

	// Extract the authorization header
	authHeader := r.Header.Get(AUTH_HEADER_NAME)

	// Create gRPC metadata with the authorization header
	md := metadata.New(map[string]string{AUTH_HEADER_NAME: authHeader})
	ctx := metadata.NewOutgoingContext(context.Background(), md)

	// Make the gRPC call to the Ping service
	req := &ping.Request{Msg: "ping"}
	resp, err := pingClient.Ping(ctx, req)
	if err != nil {
		http.Error(w, fmt.Sprintf("gRPC call failed: %v", err), http.StatusInternalServerError)
		return
	}

	// Dump some text onto the response
	_, _ = fmt.Fprintf(w, "Host:\t\t%q\n", r.Host)
	_, _ = fmt.Fprintf(w, "Path:\t\t%q\n", r.URL.Path)
	_, _ = fmt.Fprintf(w, "Count:\t\t%d\n", requestCount)
	_, _ = fmt.Fprintf(w, "gRPC Ping:\t%q\n", resp.Msg)
}

// initPingClient establishes a connection to the Ping service.
func initPingClient() error {

	// Load the gRPC service and port from the environment
	grpcService := os.Getenv("GRPC_SERVICE")
	grpcPort := os.Getenv("GRPC_PORT")
	if grpcService == "" || grpcPort == "" {
		return errors.New("GRPC_SERVICE and GRPC_PORT must be set")
	}

	// Define the connection and create the client
	conn, err := grpc.NewClient(grpcService+":"+grpcPort, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return err
	}
	pingClient = ping.NewPingServiceClient(conn)

	// All is well
	return nil
}
