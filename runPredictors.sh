#!/bin/bash

# Get the current working directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Dynamically get the path to your Node.js binary
NODE_BIN=$(which node)

# Path to the script
NODE_SCRIPT="$DIR/src/index.js generate >/tmp/predictors-script.txt"

# Running the script using node
$NODE_BIN $NODE_SCRIPT