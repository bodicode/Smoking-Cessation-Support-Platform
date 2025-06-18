import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
// @ts-ignore
import { createUploadLink } from 'apollo-upload-client';
import toast from 'react-hot-toast';

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (typeof window === 'undefined') return;

    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (
                err.message?.toLowerCase().includes('expired token') ||
                err.message?.toLowerCase().includes('unauthorized')
            ) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                localStorage.removeItem('access_token');
                window.location.href = '/';
                return;
            }
        }
    }
    if ((networkError as any)?.statusCode === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        localStorage.removeItem('access_token');
        window.location.href = '/';
    }
});

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
    link: ApolloLink.from([errorLink, authLink, uploadLink]),
    cache: new InMemoryCache(),
});

export default client;
