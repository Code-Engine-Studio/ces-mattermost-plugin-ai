package qdrant

import (
	"context"
	"fmt"
	"time"

	pb "github.com/qdrant/go-client/qdrant"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type QdrantClients struct {
	pointsClient pb.PointsClient
}
type Wiki struct {
	Title       string
	Url         string
	Description string
}

const (
	ADDR            = "qdrant-db:6334"
	COLLECTION_NAME = "ces-wiki-collection"
	SEARCH_LIMIT    = 3
)

func (qc *QdrantClients) SearchPoints(embedding []float32) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	searchResult, err := qc.pointsClient.Search(ctx, &pb.SearchPoints{
		CollectionName: COLLECTION_NAME,
		Vector:         embedding,
		Limit:          SEARCH_LIMIT,
		// Include all payload and vectors in the search result
		WithPayload: &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	})

	if err != nil {
		return "", err
	}

	result := ""

	for _, v := range searchResult.GetResult() {
		result += fmt.Sprintf("\n---------------\nTitle: %s\nContent: %s\nUrl: %s\n--------------\n",
			v.Payload["title"].GetStringValue(),
			v.Payload["description"].GetStringValue(),
			v.Payload["url"].GetStringValue())
	}

	fmt.Println("Wikiii: ", result)
	return result, nil
}

func ConnectDb() (QdrantClients, error) {
	conn, err := grpc.Dial(ADDR, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		fmt.Printf("fatal %+v\n", err)
	}

	collections_client := pb.NewCollectionsClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

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

	return QdrantClients{pointsClient}, nil
}
