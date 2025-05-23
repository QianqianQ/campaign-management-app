#!/bin/bash

if [ "$1" == "down" ]; then
echo "Stopping and removing containers..."
    docker compose -f docker-compose.dev.yml -p campaign-dev down
elif [ "$1" == "down-hard" ]; then
    echo "Stopping and removing containers, volumes, and images..."
    docker compose -f docker-compose.dev.yml -p campaign-dev down -v --remove-orphans --rmi all
elif [ "$1" == "db" ]; then
    echo "Starting database..."
    docker compose -f docker-compose.dev.yml -p campaign-dev up -d --build db
else
    echo "Starting containers..."
    docker compose -f docker-compose.dev.yml -p campaign-dev up -d --build
fi
