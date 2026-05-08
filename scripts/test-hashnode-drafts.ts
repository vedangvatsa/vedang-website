import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/vedang/vedang-website/.env.local' });
const TOKEN = process.env.HASHNODE_TOKEN!;

async function gql(query: string, variables: Record<string, any> = {}) {
  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
}
gql(`
  query GetDrafts($host: String!) {
    publication(host: $host) {
      drafts(first: 50) {
        edges { node { id slug title } }
      }
    }
  }
`, { host: "vedangvatsa.hashnode.dev" }).then(res => console.log(JSON.stringify(res.data.publication.drafts?.edges.map((e: any) => e.node), null, 2)));
