import { graphGDNClient } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const BUYER = `
  query($buyer: String!) {
  purchases(where: {buyer: $buyer}) {
          purchaseId
          collectionId
          amount
          buyer
          tokenIds
          blockNumber
          blockTimestamp
          transactionHash
          gmsCollections {
            uri
            edition
            price
            tokenIds
            collectionId
            collectionContract
            metadata {
              media
              mediaType
              title
            }
          }
        }
    }
`;

export const getBuyer = async (
  buyer: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphGDNClient.query({
    query: gql(BUYER),
    variables: { buyer },
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