#!/bin/bash

envs_array=("development" "staging" "production")
env_arg="$1"

if [[ -n "$env_arg" && ! " ${envs_array[*]} " =~ " ${env_arg} " ]]; then
    echo "\"$env_arg\" is not a valid environment. Must be one of: ${envs_array[*]}"
    exit 1
fi

if [[ -n "$env_arg" ]]; then
    env_file=".env.${env_arg}"
else
    env_file=".env"
fi

export NODE_ENV=$env_arg
export ENV_FILE=$env_file

echo "Running command with environment file $env_file: ${@:2}"
pnpm dotenvx run -f "$env_file" -- "${@:2}"
