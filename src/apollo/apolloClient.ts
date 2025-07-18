import { ApolloClient, InMemoryCache, ApolloLink, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

//@ts-ignore
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import toast from "react-hot-toast";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (typeof window === "undefined") return;

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (
        err.message?.toLowerCase().includes("expired token") ||
        err.message?.toLowerCase().includes("unauthorized") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        toast.error("Phiên đăng nhập đã hết hạn!");
        localStorage.removeItem("access_token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return;
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
    const errorMessage =
      (networkError as any)?.message || JSON.stringify(networkError);

    if ((networkError as any)?.statusCode === 401) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else {
      toast.error(`Lỗi mạng: ${errorMessage}`);
    }
  }
});

const authHttpLink = new ApolloLink((operation, forward) => {
  if (typeof window === "undefined") return forward(operation);

  const token = localStorage.getItem("access_token");

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-apollo-operation-name": operation.operationName || "unnamed",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
}) as any;

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
      createClient({
        url:
          process.env.NEXT_PUBLIC_GRAPHQL_WS_API ||
          process.env.NEXT_PUBLIC_GRAPHQL_API?.replace("http", "ws") ||
          "ws://localhost:3000/graphql",

        connectionParams: () => {
          const token = localStorage.getItem("access_token");
          return {
            Authorization: token ? `Bearer ${token}` : "",
          };
        },
      })
    )
    : null;

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      authHttpLink.concat(httpLink)
    )
    : authHttpLink.concat(httpLink);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache: new InMemoryCache(),
});

export default client;
