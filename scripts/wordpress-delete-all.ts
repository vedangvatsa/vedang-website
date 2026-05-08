import { fetch } from 'undici';

const WP_DOMAIN = 'vedangvatsa.wordpress.com';
const WP_USER = 'vatsvedang';
const WP_PASS = 'hr3a 7wd4 rcvt ao6s';

async function main() {
  console.log('Fetching ALL posts to delete...');
  let totalDeleted = 0;
  
  while (true) {
      const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
    <methodCall>
      <methodName>wp.getPosts</methodName>
      <params>
        <param><value><int>1</int></value></param>
        <param><value><string>${WP_USER}</string></value></param>
        <param><value><string>${WP_PASS}</string></value></param>
        <param><value><struct><member><name>number</name><value><int>100</int></value></member></struct></value></param>
      </params>
    </methodCall>`;

      const res = await fetch(`https://${WP_DOMAIN}/xmlrpc.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml' },
        body: xmlPayload
      });
      
      const text = await res.text();
      const ids = [...text.matchAll(/<name>post_id<\/name>\s*<value><string>(\d+)<\/string>/g)].map(m => m[1]);
      
      if (ids.length === 0) break;
      
      console.log(`Found batch of ${ids.length} posts to delete.`);
      for (const id of ids) {
        const delPayload = `<?xml version="1.0" encoding="UTF-8"?>
    <methodCall>
      <methodName>wp.deletePost</methodName>
      <params>
        <param><value><int>1</int></value></param>
        <param><value><string>${WP_USER}</string></value></param>
        <param><value><string>${WP_PASS}</string></value></param>
        <param><value><int>${id}</int></value></param>
      </params>
    </methodCall>`;
        await fetch(`https://${WP_DOMAIN}/xmlrpc.php`, { method: 'POST', headers: { 'Content-Type': 'text/xml' }, body: delPayload });
        totalDeleted++;
      }
  }
  console.log(`Finished deleting ${totalDeleted} posts.`);
}
main();
