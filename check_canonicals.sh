#!/bin/bash
urls=$(curl -s "https://veda.ng/sitemap.xml" | grep -oE 'https://veda\.ng[^<]*' | sort -u)
total=$(echo "$urls" | wc -l | tr -d ' ')
echo "Checking $total URLs..."
echo ""

correct=0
wrong=0
nomatch=0

echo "$urls" | while read url; do
  path=$(echo "$url" | sed 's|https://veda.ng||')
  [ -z "$path" ] && path="/"
  
  canonical=$(curl -s --max-time 10 "$url" | grep -oE 'rel="canonical" href="[^"]*"' | head -1 | sed 's/rel="canonical" href="//' | sed 's/"//')
  
  if [ -z "$canonical" ]; then
    echo "⚠️  NO CANONICAL  $path"
  elif [ "$canonical" = "$url" ] || [ "$canonical" = "https://veda.ng$path" ]; then
    : # correct, silent
  else
    echo "❌ WRONG  $path"
    echo "         got: $canonical"
    echo "         want: $url"
  fi
done
