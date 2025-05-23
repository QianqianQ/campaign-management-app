#!/bin/bash

if [ "$1" == "down" ]; then
    echo "Stopping and removing containers..."
    docker compose -f docker-compose.yml -p campaign-prod down
elif [ "$1" == "down-hard" ]; then
    echo "Stopping and removing containers, volumes, and images..."
    docker compose -f docker-compose.yml -p campaign-prod down -v --remove-orphans --rmi all --stop
else
    echo "Starting containers..."
    docker compose -f docker-compose.yml -p campaign-prod up -d --build
fi
