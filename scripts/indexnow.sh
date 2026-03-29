#!/usr/bin/env bash
# Ping IndexNow with URLs that changed between the current and previous commit.
# Run after deploy: ./scripts/indexnow.sh
#
# Requires: curl, git
# Optional env: INDEXNOW_KEY (defaults to the key in static/)

set -euo pipefail

HOST="scanopy.net"
KEY="${INDEXNOW_KEY:-2c25a6ca44a94f73963bb0e43613d656}"
KEY_LOCATION="https://$HOST/$KEY.txt"
API_URL="https://api.indexnow.org/indexnow"

# Map changed source files to public URLs
urls=()

for file in $(git diff --name-only HEAD~1 HEAD 2>/dev/null); do
  case "$file" in
    src/routes/+page.svelte)
      urls+=("https://$HOST/") ;;
    src/routes/pricing/*)
      urls+=("https://$HOST/pricing") ;;
    src/routes/about/*)
      urls+=("https://$HOST/about") ;;
    src/routes/blog/+page.svelte)
      urls+=("https://$HOST/blog") ;;
    src/routes/services/*)
      urls+=("https://$HOST/services") ;;
    src/routes/roadmap/*)
      urls+=("https://$HOST/roadmap") ;;
    src/routes/community/*)
      urls+=("https://$HOST/community") ;;
    src/routes/press/*)
      urls+=("https://$HOST/press") ;;
    src/lib/blog/*.md)
      slug=$(basename "$file" .md)
      urls+=("https://$HOST/blog/$slug") ;;
    src/lib/changelog/*.md)
      version=$(basename "$file" .md)
      urls+=("https://$HOST/changelog/$version")
      urls+=("https://$HOST/changelog") ;;
  esac
done

# Deduplicate
readarray -t urls < <(printf '%s\n' "${urls[@]}" | sort -u)

if [ ${#urls[@]} -eq 0 ]; then
  echo "No indexable URLs changed — skipping IndexNow ping."
  exit 0
fi

echo "Submitting ${#urls[@]} URL(s) to IndexNow:"
printf '  %s\n' "${urls[@]}"

# Build JSON payload
url_json=$(printf '%s\n' "${urls[@]}" | jq -R . | jq -s .)

payload=$(jq -n \
  --arg host "$HOST" \
  --arg key "$KEY" \
  --arg keyLocation "$KEY_LOCATION" \
  --argjson urlList "$url_json" \
  '{host: $host, key: $key, keyLocation: $keyLocation, urlList: $urlList}')

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$payload")

http_code=$(echo "$response" | tail -1)

if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
  echo "IndexNow accepted (HTTP $http_code)"
else
  echo "IndexNow returned HTTP $http_code"
  echo "$response" | sed '$d'
  exit 1
fi
