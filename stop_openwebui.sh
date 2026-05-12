#!/bin/bash

# Script to safely stop Open WebUI container.
# Since it uses 'unless-stopped' or 'always' restart policy, 
# 'docker stop' will ensure it doesn't restart until manually started again.

CONTAINER_NAME="open-webui"

echo "Checking $CONTAINER_NAME container status..."
if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "Stopping $CONTAINER_NAME container..."
    docker stop "$CONTAINER_NAME"
    if [ $? -eq 0 ]; then
        echo "$CONTAINER_NAME container has been stopped successfully."
    else
        echo "Failed to stop $CONTAINER_NAME container. Please check for errors."
        exit 1
    fi
else
    if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
        echo "$CONTAINER_NAME container is already stopped or in a non-running state."
    else
        echo "$CONTAINER_NAME container does not exist."
    fi
fi

echo "Note: To restart the container, you can run: docker start $CONTAINER_NAME"
