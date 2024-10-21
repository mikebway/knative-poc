package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"

	cloudevents "github.com/cloudevents/sdk-go/v2"
	"github.com/redis/go-redis/v9"
)

var (
	// Access to the Redis database
	redisClient *redis.Client

	// Redis data keys
	pingCountKey = "pingCount"
)

// receive is invoked to handle each CloudEvent forwarded to this service.
//
// Optionally, it could return a CloudEvent in response but we have no need to do that here.
func receive(event cloudevents.Event) {

	// Log the event
	fmt.Printf("☁️  cloudevents.Event\n%s\n", event.String())

	// Increment the count of events seen in Redis
	ctx := context.Background()
	err := redisClient.Incr(ctx, "event_count").Err()
	if err != nil {
		log.Printf("failed to increment event count: %v\n", err)
	}
}

// Application entry point establishes our connection to the CloudEvents
func main() {

	// Configure our Redis client
	err := initRedisClient()
	if err != nil {
		log.Fatalf("failed to establish Redis client: %v", err)
	}

	// Start the CloudEvents reception handler
	ceClient, err := cloudevents.NewDefaultClient()
	if err != nil {
		log.Fatal("Failed to create client, ", err)
	}
	log.Fatal(ceClient.StartReceiver(context.Background(), receive))
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
