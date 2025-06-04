import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';

const authLink = new ApolloLink((operation, forward) => {
    if (typeof window === 'undefined') return forward(operation);

    const token = localStorage.getItem('access_token');

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            'x-apollo-operation-name': operation.operationName || 'unnamed',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    }));

    return forward(operation);
});

const uploadLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
}) as any;

const client = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache(),
});

export default client;
