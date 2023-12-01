package main

import (
	"context"
	"fmt"
	"time"

	pb "github.com/qdrant/go-client/qdrant"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type VectorDbClient struct {
	QdrantClient pb.QdrantClient
	PointsClient pb.PointsClient
}

func (c *VectorDbClient) SearchPoints(embedding []float32) string {
	ctx, _ := context.WithTimeout(context.Background(), time.Second)

	unfilteredSearchResult, _ := c.PointsClient.Search(ctx, &pb.SearchPoints{
		CollectionName: "qdrant",
		Vector:         embedding,
		Limit:          1,
		// Include all payload and vectors in the search result
		WithPayload: &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	})
	result := unfilteredSearchResult.GetResult()[0].Payload
	fmt.Printf("Found points result: %s", result["description"].GetStringValue())
	return result["description"].GetStringValue()
}

func connectDb() (VectorDbClient, error) {
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

	// Create points grpc client
	pointsClient := pb.NewPointsClient(conn)

	return VectorDbClient{QdrantClient: qdrantClient, PointsClient: pointsClient}, nil
}
