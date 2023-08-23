FROM golang:1.21

# Set Working Directory
WORKDIR /app

# Install Deps
COPY go.mod go.sum ./
RUN go mod download

# Copy Source Code
COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /registry

EXPOSE 4000

# Run
CMD ["/registry"]
