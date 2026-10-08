#!/bin/bash

mkdir -p src/lib/pocketbase/__generated__
pnpm pocketbase-typegen --env .env.development --db pb_data/data.db --out src/lib/pocketbase/__generated__/types.ts
