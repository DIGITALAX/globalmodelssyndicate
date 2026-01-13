import { graphGDNClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const COLLECTIONS_PAGINATED = `
  query($first: Int, $skip: Int) {
  gmsCollections(first: $first, skip: $skip) {
        collectionId
        dropId
        edition
        price
        uri
        collectionContract
        designerId
        modelProfile {
          uri
          wallet
          modelId
          metadata {
            image
            title
            cover
            description
            link
          }
        }
        drop {
          dropId
          modelId
          uri
          metadata {
            image
            title
            description
          }
          modelProfile {
            wallet
            modelId
            uri
            metadata {
              image
              title
              cover
              description
              link
            }
          }
        }
        metadata {
          title
          description
          media
          mediaType
        }
        tokenIds
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
`;

export const getCollectionsPaginated = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(COLLECTIONS_PAGINATED),
    variables: { first, skip },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

const COLLECTION = `
  query($collectionId: Int!, $collectionContract: String!) {
  gmsCollections(where: {collectionId: $collectionId, collectionContract: $collectionContract}) {
      collectionId
      dropId
      edition
      price
      uri
      collectionContract
      modelId
      modelProfile {
        wallet
        modelId
        w3fReceived
        lastActivity
        totalSales
        uniqueBuyers
        uri
        metadata {
          image
          title
          link
          description
          cover
        }
        blockNumber
        blockTimestamp
        transactionHash
      }
      metadata
      tokenIds
      drop {
        uri
        gmsCollections {
          collectionId
          uri
          edition
          metadata {
          title
          description
          media
          mediaType
          prompt
          model
          workflow
          }
        }
        metadata {
          title
          image
        }
      }
      blockNumber
      blockTimestamp
      transactionHash
      }
    }
`;

export const getCollection = async (
  collectionId: number,
  collectionContract: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(COLLECTION),
    variables: { collectionId, collectionContract },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
