import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getGDNUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/gdn`;
  }
  return "/api/graphql/gdn";
};

const gdnLink = new HttpLink({
  uri: getGDNUri(),
});

export const graphGDNClient = new ApolloClient({
  link: gdnLink,
  cache: new InMemoryCache(),
});
