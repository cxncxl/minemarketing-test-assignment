#!/usr/bin/env bash
set -e

echo "==> Running pending migrations…"
npm run typeorm migration:run -- -d migration/datasource.ts

echo "==> Starting application…"
exec node dist/src/main.js
