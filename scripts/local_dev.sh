#!/bin/bash

if [ "$1" == "server" ]; then
    echo "Starting server..."
    cd server && source .venv/bin/activate && python manage.py runserver
elif [ "$1" == "client" ]; then
    echo "Starting client..."
    cd client && npm run dev
elif [ "$1" == "db" ]; then
    echo "Starting database..."
    docker compose -f docker-compose.dev.yml -p localhost up --build -d db
elif [ "$1" == "db-down" ]; then
    echo "Stopping database..."
    docker compose -f docker-compose.dev.yml -p localhost down db
else
    echo "Starting all services..."
    # Start tmux session
    tmux new-session -d -s local_dev

    # Split the window into three panes
    tmux split-window -v
    tmux split-window -h

    # if database is not running, start from a dockerized one
    tmux send-keys -t local_dev:0.0 "docker compose -f docker-compose.dev.yml -p localhost up --build db" C-m

    # Wait for the database to be ready
    echo "Waiting for the database to be ready..."
    while ! docker exec -it localhost-db-1 pg_isready -U postgres -h localhost > /dev/null 2>&1; do
    sleep 2
    done
    echo "Database is ready"

    # server
    tmux send-keys -t local_dev:0.1 "cd server && source .venv/bin/activate && python manage.py runserver" C-m

    # client
    tmux send-keys -t local_dev:0.2 "cd client && npm run dev" C-m

    # Attach to the tmux session
    tmux attach-session -t local_dev
fi
