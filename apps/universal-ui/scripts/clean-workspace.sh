#!/bin/bash

CURRENT_DIR=$(dirname "$0")

echo "Removing build outputs, distributables, and node_modules..."

# `-prune` excludes the specified path
# Esssentially, the following command will remove any directory or file that
# is not in any of the specified paths and that does match the glob patterns.

find . \
    -path ./src -prune -o \
    -path ./.git -prune -o \
    -path ./.github -prune -o \
    -path ./node_modules -prune -o \
    -path ./ios/Pods -prune -o \
    -path ./ios/build -prune -o \
    -path ./vendor -prune -o \
    -path ./scripts -prune -o \
    \( \
        -name "*build*" -type d -o \
        -name "*.apk" -type f -o \
        -name "*.jsbundle" -type f -o \
    \) \
    -print0 | xargs -0 rm -rf

rm -rf node_modules/ ios/Pods/ ios/build android/ .env .expo/ .tamagui/

echo "Cleaning Metro cache..."

rm -rf $TMPDIR/metro-cache

echo "Resetting Watchman..."

watchman watch-del-all

echo "Pruning pnpm store..."

pnpm store prune

echo "Installing node_modules..."

pnpm install
