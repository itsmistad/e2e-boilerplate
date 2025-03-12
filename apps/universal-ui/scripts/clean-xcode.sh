#!/bin/bash

CURRENT_DIR=$(dirname "$0")
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "XCode is only available on Mac OS."
    exit 1
fi

echo "Cleaning XCode's \"DerivedData\"..."

DERIVED_DATA_PATH=$HOME/Library/Developer/Xcode/DerivedData
DERIVED_DATA_TARGETS=$(find "$DERIVED_DATA_PATH" -maxdepth 1 -type d -print | tail --lines=+2)

echo "$DERIVED_DATA_TARGETS" | tr '\n' '\0' | xargs -0 rm -rf

echo "Shutting down all booted simulators..."

xcrun simctl shutdown all

echo "Erasing all content and settings on all simulators..."

xcrun simctl erase all

echo "Installing CocoaPods..."

cd "$CURRENT_DIR/../ios"; bundle exec pod repo remove trunk; bundle exec pod update
