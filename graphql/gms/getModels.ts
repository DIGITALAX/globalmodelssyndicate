import { graphGDNClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const MODELS_PAGINATED = `
  query($first: Int, $skip: Int) {
  models(first: $first, skip: $skip) {
        wallet
        modelId
        w3fReceived
        lastActivity
        totalSales
        uniqueBuyers
        uri
        metadata {
          title
          image
          description
          cover
          link
        }
      }
    }
`;

export const getModelsPaginated = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(MODELS_PAGINATED),
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

const MODEL = `
  query($wallet: String) {
  models(where: {wallet: $wallet}) {
        wallet
        modelId
        w3fReceived
        lastActivity
        totalSales
        uniqueBuyers
        uri
        metadata {
          title
          image
          description
          cover
          link
        }
        blockNumber
        blockTimestamp
        transactionHash
        drops {
          uri
          dropId
          blockNumber
          blockTimestamp
          transactionHash
          metadata {
            image
            title
            description
          }
        }
        collections {
          collectionId
          edition
          uri
          collectionContract
          tokenIds
          blockNumber
          blockTimestamp
          transactionHash
          price
          metadata {
            title
            description
            media
            mediaType
            model
            prompt
            workflow
          }
          drop {
            dropId
            uri
            metadata {
              image
              title
              description
            }
          }
        }
      }
    }
`;

export const getModel = async (
  wallet: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(MODEL),
    variables: { wallet },
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
