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
  query GetPost($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) { content { markdown } }
    }
  }
`, { host: "vedangvatsa.hashnode.dev", slug: "singularity-paradox" }).then(res => console.log(res.data.publication.post.content.markdown.slice(0, 500)));
