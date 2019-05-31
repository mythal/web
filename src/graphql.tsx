import axios from 'axios';


export const GraphQL = 'http://127.0.0.1:8000/graphql';


export function runQuery<T>(query: string, variables: object = {}): Promise<T> {
    return axios
        .post(GraphQL, { query, variables })
        .then(({ data }) => data.data);
}
