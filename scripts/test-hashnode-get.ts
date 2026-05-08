import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '/Users/vedang/vedang-website/.env.local' });
const TOKEN = process.env.HASHNODE_TOKEN!;

async function gql(query: string, variables: Record<string, any> = {}): Promise<any> {
  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json() as any;
  if (data.errors) throw new Error(data.errors.map((e: any) => e.message).join('; '));
  return data.data;
}

async function main() {
  const q = `
    query getPosts($host: String!) {
      publication(host: $host) {
        posts(first: 50) {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    }
  `;
  const data = await gql(q, { host: "vedangvatsa.hashnode.dev" });
  console.log(data.publication.posts.edges.slice(0, 5).map((e: any) => e.node));
}
main();
