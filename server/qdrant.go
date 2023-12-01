package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"time"

	pb "github.com/qdrant/go-client/qdrant"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	openai "github.com/sashabaranov/go-openai"
)

var (
	addr           = flag.String("addr", "qdrant-db:6334", "the address to connect to")
	collectionName = "qdrant"
	// vectorSize     uint64 = 1536
)

func connectDb() {
	// TODO: update this to use the key in env
	client := openai.NewClient("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")

	// Create an EmbeddingRequest for the user query
	queryReq := openai.EmbeddingRequest{
		Input: []string{"Alien Invasion"},
		Model: openai.AdaEmbeddingV2,
	}

	// Create an embedding for the user query
	queryResponse, err := client.CreateEmbeddings(context.Background(), queryReq)
	if err != nil {
		log.Fatal("Error creating query embedding:", err)
	}
	fmt.Printf("bf", "queryEmbedding")
	queryEmbedding := queryResponse.Data[0]
	fmt.Printf("at", queryEmbedding)
	flag.Parse()
	// Set up a connection to the server.
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	collections_client := pb.NewCollectionsClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	// Check Qdrant version
	qdrantClient := pb.NewQdrantClient(conn)
	healthCheckResult, err := qdrantClient.HealthCheck(ctx, &pb.HealthCheckRequest{})
	if err != nil {
		log.Fatalf("Could not get health: %v", err)
	} else {
		log.Printf("Qdrant version: %s", healthCheckResult.GetVersion())
	}

	// List all created collections
	r, err := collections_client.List(ctx, &pb.ListCollectionsRequest{})
	if err != nil {
		log.Fatalf("Could not get collections: %v", err)
	} else {
		log.Printf("List of collections: %s", r.GetCollections())
	}

	// Create points grpc client
	pointsClient := pb.NewPointsClient(conn)

	// Unfiltered search
	unfilteredSearchResult, err := pointsClient.Search(ctx, &pb.SearchPoints{
		CollectionName: collectionName,
		Vector:         queryEmbedding.Embedding,
		Limit:          3,
		// Include all payload and vectors in the search result
		WithVectors: &pb.WithVectorsSelector{SelectorOptions: &pb.WithVectorsSelector_Enable{Enable: true}},
		WithPayload: &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	})
	if err != nil {
		log.Fatalf("Could not search points: %v", err)
	} else {
		log.Printf("Found points: %s\n", unfilteredSearchResult.GetResult()[0].Payload)
	}
}
