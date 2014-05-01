#!/bin/bash


if pgrep -f "node `which node-inspector`"; then
  echo "node-inspector is running..."
else
  echo "Starting node-inspector..."
  if nohup node-inspector \&; then
    EXIT_CODE = $?
    echo "Failed to start node-inspector daemon. Exit Code: $EXIT_CODE"
    exit $EXIT_CODE
  fi
fi

open -a Google\ Chrome
node --debug-brk "$@" 
