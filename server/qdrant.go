package main

import (
	"context"
	"fmt"
	"time"

	pb "github.com/qdrant/go-client/qdrant"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func connectDb() (pb.QdrantClient, error) {
	// TODO: Use env variable for the connection address
	addr := "qdrant-db:6334"
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		fmt.Printf("fatal %+v\n", err)
	}

	collections_client := pb.NewCollectionsClient(conn)

	ctx, _ := context.WithTimeout(context.Background(), time.Second)

	qdrantClient := pb.NewQdrantClient(conn)
	healthCheckResult, err := qdrantClient.HealthCheck(ctx, &pb.HealthCheckRequest{})
	if err != nil {
		fmt.Printf("fatal Could not get health: %v", err)
	} else {
		fmt.Printf("Qdrant version: %s", healthCheckResult.GetVersion())
	}

	r, err := collections_client.List(ctx, &pb.ListCollectionsRequest{})
	if err != nil {
		fmt.Printf("fatal Could not get collections: %v", err)
	} else {
		fmt.Printf("List of collections: %s", r.GetCollections())
	}
	return qdrantClient, nil
}
