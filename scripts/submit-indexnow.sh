#!/bin/bash
# Submit all sitemap URLs to IndexNow (Bing, Yandex, Naver, Seznam)
# Run after Vercel deployment completes

KEY="efeb4c9b344b48a9819cd02571aab0ed"
HOST="veda.ng"

# Check if key file is live
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://${HOST}/${KEY}.txt")
if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Key file not live yet (HTTP $HTTP_CODE). Wait for Vercel deploy and retry."
  exit 1
fi

echo "✅ Key file is live"

# Build payload from sitemap
URLS=$(curl -s "https://${HOST}/sitemap.xml" | sed -n 's/.*<loc>\(.*\)<\/loc>.*/\1/p')
COUNT=$(echo "$URLS" | wc -l | tr -d ' ')
echo "📋 Found $COUNT URLs"

PAYLOAD=$(echo "$URLS" | python3 -c "
import sys, json
urls = [l.strip() for l in sys.stdin if l.strip()]
print(json.dumps({
    'host': '${HOST}',
    'key': '${KEY}',
    'keyLocation': 'https://${HOST}/${KEY}.txt',
    'urlList': urls
}))
")

# Submit to IndexNow
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
  echo "✅ IndexNow accepted $COUNT URLs (HTTP $HTTP_CODE)"
else
  echo "❌ IndexNow returned HTTP $HTTP_CODE"
  echo "$BODY"
fi
