import { graphGDNClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const DESIGNERS_PAGINATED = `
  query($first: Int, $skip: Int) {
  designers(first: $first, skip: $skip) {
        wallet
        designerId
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

export const getDesignersPaginated = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(DESIGNERS_PAGINATED),
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

const DESIGNER = `
  query($wallet: String) {
  designers(where: {wallet: $wallet}) {
        wallet
        designerId
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

export const getDesigner = async (
  wallet: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(DESIGNER),
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
