package main

import (
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"strings"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/reflection"

	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/mikebway/knative-poc/grpc-ping/ping"
)

const (
	DEFAULT_PORT     = "8080"
	AUTH_HEADER_NAME = "x-extauth-authorization"
)

type pingServer struct {
	ping.UnimplementedPingServiceServer
}

func (p *pingServer) Ping(ctx context.Context, req *ping.Request) (*ping.Response, error) {
	subject, err := authorize(ctx)
	if err != nil {
		return nil, err
	}
	return &ping.Response{Msg: fmt.Sprintf("%s - pong (subject: %s)", req.Msg, subject)}, nil
}

func (p *pingServer) PingStream(stream ping.PingService_PingStreamServer) error {
	subject, err := authorize(stream.Context())
	if err != nil {
		return err
	}
	for {
		req, err := stream.Recv()

		if err == io.EOF {
			fmt.Println("Client disconnected")
			return nil
		}

		if err != nil {
			fmt.Println("Failed to receive ping")
			return err
		}

		fmt.Printf("Replying to ping %s at %s\n", req.Msg, time.Now())

		err = stream.Send(&ping.Response{
			Msg: fmt.Sprintf("%s - pong (subject: %s)", req.Msg, subject),
		})

		if err != nil {
			fmt.Printf("Failed to send pong %s\n", err)
			return err
		}
	}
}

func authorize(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", fmt.Errorf("missing metadata")
	}

	authHeader, ok := md[AUTH_HEADER_NAME]
	if !ok || len(authHeader) == 0 {
		return "", fmt.Errorf("missing authorization header")
	}

	// WARNING: Do not not use jwt.ParseUnverified() in production code!!!
	tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return "", fmt.Errorf("invalid token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok {
		subject := claims["sub"].(string)
		if subject == "" {
			subject = "jwt subject not defined"
		}
		return subject, nil
	} else {
		return "", fmt.Errorf("invalid token claims")
	}
}

func main() {

	port := os.Getenv("PORT")
	if port == "" {
		port = DEFAULT_PORT
		fmt.Printf("Defaulting to port %s\n", port)
	}

	fmt.Printf("Starting server on port %s\n", port)
	lis, err := net.Listen("tcp", "0.0.0.0:"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	pingServer := &pingServer{}

	// The grpcServer is currently configured to serve h2c traffic by default.
	// To configure credentials or encryption, see: https://grpc.io/docs/guides/auth.html#go
	grpcServer := grpc.NewServer()
	reflection.Register(grpcServer)
	ping.RegisterPingServiceServer(grpcServer, pingServer)
	err = grpcServer.Serve(lis)
	_ = fmt.Errorf("Failed to serve: %s\n", err)
}
