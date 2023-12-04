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
	PointsClient pb.PointsClient
}
type Wiki struct {
	Title       string
	Url         string
	Description string
}

const (
	addr           = "qdrant-db:6334"
	collectionName = "ces-wiki-collection"
)

func (qc *QdrantClients) SearchPoints(embedding []float32) (Wiki, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	unfilteredSearchResult, err := qc.PointsClient.Search(ctx, &pb.SearchPoints{
		CollectionName: collectionName,
		Vector:         embedding,
		Limit:          1,
		// Include all payload and vectors in the search result
		WithPayload: &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	})

	if err != nil {
		return Wiki{}, err
	}

	if len(unfilteredSearchResult.GetResult()) == 0 {
		return Wiki{}, nil
	}

	result := unfilteredSearchResult.GetResult()[0].Payload

	return Wiki{
		Title:       result["title"].GetStringValue(),
		Url:         result["url"].GetStringValue(),
		Description: result["description"].GetStringValue(),
	}, nil
}

func ConnectDb() (QdrantClients, error) {
	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
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

	return QdrantClients{PointsClient: pointsClient}, nil
}
