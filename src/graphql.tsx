import axios from 'axios';
import { url } from './utils';

export const GraphQL = url('graphql');

export function runQuery<T>(query: string, variables: object = {}): Promise<T> {
    return axios
        .post(GraphQL, { query, variables })
        .then(({ data }) => data.data);
}
