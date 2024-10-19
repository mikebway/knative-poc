package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/redis/go-redis/v9"
)

const (
	DEFAULT_PORT     = "8080"
	AUTH_HEADER_NAME = "x-extauth-authorization"
)

var (
	// Access to the Redis database
	redisClient *redis.Client

	// Redis data keys
	lastPathKey = "lastPath"
)

// main is the command line entry point to the application.
func main() {

	// Route request for the root URL path and everything else under it
	http.HandleFunc("/", handleRoot)

	// Configure our Redis client
	err := initRedisClient()
	if err != nil {
		log.Fatalf("failed to establish Redis client: %v", err)
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

	// Log the URL that we have been asked for etc
	log.Printf("handling request = %s\n", r.URL.Path)

	// As a crude confirmation that we are handling requests and connecting to Redis,
	// retrieve the last URL path that we processed from the Redis database
	ctx := context.Background()
	lastPath, err := redisClient.Get(ctx, lastPathKey).Result()
	if err != nil && err != redis.Nil {
		msg := fmt.Sprintf("redis get for lastPath failed: %v", err)
		log.Println(msg)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	// Store the current URL path in the Redis database
	err = redisClient.Set(ctx, lastPathKey, r.URL.Path, 0).Err()
	if err != nil {
		msg := fmt.Sprintf("redis set for lastPath failed: %v", err)
		log.Println(msg)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	// Dump some text onto the response
	_, _ = fmt.Fprintf(w, "Host:\t\t%s\n", r.Host)
	_, _ = fmt.Fprintf(w, "Path:\t\t%s\n", r.URL.Path)
	_, _ = fmt.Fprintf(w, "Last path:\t%s\n", lastPath)
}

// initRedisClient a connection to the Redis database service.
func initRedisClient() error {

	// How do we connect to the Redis database
	redisServer := os.Getenv("REDIS_SERVICE")
	redisPort := os.Getenv("REDIS_PORT")
	redisPassowrd := os.Getenv("REDIS_PASSWORD")

	if redisServer == "" || redisPort == "" || redisPassowrd == "" {
		return errors.New("environment must define all of REDIS_SERVICE, REDIS_PORT and REDIS_PASSWORD")
	}

	// Connect to the Redis database
	redisClient = redis.NewClient(&redis.Options{
		Addr:     redisServer + ":" + redisPort,
		Password: redisPassowrd,
		DB:       0, // Use default DB
		Protocol: 2, // Connection protocol
	})

	// All is well
	return nil
}
