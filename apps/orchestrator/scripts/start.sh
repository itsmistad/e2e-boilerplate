#!/bin/bash

env_arg="$1"

if [[ -z "$env_arg" ]]; then
    echo "Environment argument is required: development, staging, production"
    exit 1
fi

HTTP_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8090/api/health)
if [[ "$HTTP_STATUS" == "200" ]]; then
    ./scripts/env.sh $env_arg tsx ./src/index.ts
else
    echo -e "\033[0;31mMake sure to run 'pnpm pb:serve' first.\033[0m"
fi
