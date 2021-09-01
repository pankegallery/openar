import {
  from,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  HttpLink,
} from "@apollo/client";
import { authRefreshMutationGQL } from "~/graphql/mutations";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

import { authentication, user } from ".";

import type { AppConfig } from "~/types";

import { appConfig } from "~/config";


export let client: ApolloClient<any> | null = null;

const authLink = new ApolloLink((operation, forward) => {
  // retrieve access token from memory
  const accessToken = authentication.getAuthToken();
  
  if (accessToken) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${accessToken.token}`,
      },
    }));
  }

  // Call the next link in the middleware chain.
  return forward(operation);
});

// Log any GraphQL errors or network error that occurred
const retryWithRefreshTokenLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      const observables: Observable<any>[] = graphQLErrors.reduce(
        (observables, graphQLError) => {
          const { message, extensions } = graphQLError;

          console.log(123, message, extensions, 123);

          if (message === "Access Denied" && extensions?.code === "FORBIDDEN") {
            const observableForbidden = new Observable((observer) => {
              new Promise(async (resolve) => {
                console.log(
                  "logout() ApolloClient.retryWithRefreshTokenLink: FORBIDDEN"
                );
                await user.logout();
                observer.error(new Error("Access Denied - FORBIDDEN "));
              });
            });
            observables.push(observableForbidden);
          } else if (
            message === "Authentication failed (maybe refresh)" &&
            extensions?.code === "UNAUTHENTICATED"
          ) {
            const observable = new Observable((observer) => {
              user.setAllowRefresh(false);
              user.setRefreshing(true);
              client
                .mutate({
                  fetchPolicy: "no-cache",
                  mutation: authRefreshMutationGQL,
                }) // TODO: is there a way to get a typed query here?
                .then(({ data }: any) => {
                  if (
                    data?.authRefresh?.tokens?.access &&
                    data?.authRefresh?.tokens?.refresh
                  ) {
                    const payload = authentication.getTokenPayload(
                      data.authRefresh.tokens.access
                    );

                    if (payload) {
                      authentication.setAuthToken(
                        data.authRefresh.tokens.access
                      );
                      authentication.setRefreshCookie(
                        data.authRefresh.tokens.refresh
                      );

                      user.setAllowRefresh(true);
                      user.login(payload.user);

                      operation.setContext(({ headers = {} }) => ({
                        headers: {
                          ...headers,
                          authorization: `Bearer ${data.authRefresh.tokens.access.token}`,
                        },
                      }));
                    } else {
                      throw new Error("Unable to fetch new access token (1)");
                    }
                  } else {
                    throw new Error("Unable to fetch new access token (2)");
                  }
                })
                .then(() => {
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };

                  forward(operation).subscribe(subscriber);
                })
                .catch(async (error) => {
                  console.log(
                    "logout() ApolloClient.retryWithRefreshTokenLink: refresh error"
                  );
                  await user.logout();

                  observer.error(error);
                });
            });
            observables.push(observable);
          }
          return observables;
        },
        [] as Observable<any>[]
      );

      if (observables.length) return observables.shift();
    }
  }
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    // TODO: remove?
    graphQLErrors.forEach((err) =>
      console.log(
        err,
        `[GQLError error]: ${err.message} ${err?.extensions?.code ?? ""}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const createApolloClient = (appConfig: AppConfig) => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([
      authLink,
      retryWithRefreshTokenLink,
      new RetryLink({
        delay: {
          initial: 500,
          max: 20000,
          jitter: true,
        },
        attempts: {
          max: 3,
          retryIf: (error, _operation) => {
            console.log(
              error,
              `Will retry C:${parseInt(error.statusCode, 10)} ${
                !!error &&
                ![400, 403, 404].includes(parseInt(error.statusCode, 10))
              }`
            );
            return (
              !!error &&
              ![400, 403, 404].includes(parseInt(error.statusCode, 10))
            );
          },
        },
      }),
      errorLink,
      new HttpLink({
        uri: appConfig.apiGraphQLUrl, // Server URL (must be absolute)
        credentials: "include", // Additional fetch() options like `credentials` or `headers`
      }),
    ]),
    // TODO: find generic ways to manage the chache ...
    // HOW TO ENSURE deletion/updates are reflected in the cache ...
    // how will the cache expire?
    cache: new InMemoryCache({
      // typePolicies: {
      //   Query: {
      //     fields: {
      //       allPosts: concatPagination(), // TODO: adjust to useful results ..., not working ... https://github.com/apollographql/apollo-client/issues/6679
      //     },
      //   },
      // },¸
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "ignore",
      },
      query: {
        // TODO: revist better caching at some point
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
};

export const initializeClient = (appConfig: AppConfig) => {
  const aClient = client ?? createApolloClient(appConfig);

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return aClient;
  // Create the Apollo Client once in the client
  if (!client) client = aClient;

  return aClient;
};

export const getApolloClient = () => initializeClient(appConfig)

const defaults = {
  client,
  initializeClient,
};

export default defaults;
