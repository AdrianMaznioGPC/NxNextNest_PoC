#!/bin/bash
#
# Run all k6 resilience load test scenarios sequentially.
#
# Prerequisites:
#   1. k6 installed:  brew install k6
#   2. BFF running in chaos mode:  BFF_BACKEND=chaos npx nx run bff:dev
#
# Usage:
#   ./k6/run-all.sh                           # defaults to localhost:4000
#   BFF_URL=http://my-host:4000 ./k6/run-all.sh
#
# Each scenario resets the chaos config before running.
# Results are printed to stdout after each scenario.
# Exit code is non-zero if any scenario fails its thresholds.

set -euo pipefail

BFF_URL="${BFF_URL:-http://localhost:4000}"
export BFF_URL

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCENARIOS_DIR="$SCRIPT_DIR/scenarios"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}BFF URL: ${BFF_URL}${NC}"
echo ""

# Reset chaos before starting
echo -e "${YELLOW}Resetting chaos config...${NC}"
curl -s -X POST "${BFF_URL}/chaos/reset" -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1 || {
  echo -e "${RED}Failed to reach BFF at ${BFF_URL}. Is it running with BFF_BACKEND=chaos?${NC}"
  exit 1
}

FAILED=0

run_scenario() {
  local file="$1"
  local name
  name="$(basename "$file" .js)"

  echo ""
  echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  Running: ${name}${NC}"
  echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
  echo ""

  if k6 run "$file"; then
    echo -e "${GREEN}  ✓ ${name} passed${NC}"
  else
    echo -e "${RED}  ✗ ${name} failed${NC}"
    FAILED=$((FAILED + 1))
  fi

  # Brief pause between scenarios to let BFF settle
  sleep 2
}

# Run scenarios in order
for scenario in "$SCENARIOS_DIR"/[0-9]*.js; do
  run_scenario "$scenario"
done

echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}  All scenarios passed!${NC}"
else
  echo -e "${RED}  ${FAILED} scenario(s) failed${NC}"
fi
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"

exit "$FAILED"
