if [ -f .env.test ]; then
    export $(cat .env.test | grep -v '^#' | xargs)
    echo "Environment variables from .env file loaded."

    echo "$POSTGRES_HOST"
else
    echo "Error: .env file not found."
fi

bun test