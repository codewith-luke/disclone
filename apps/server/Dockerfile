# Use the golang offical image
# Use alpine because smaller images for Luke his HUGE SSD
FROM golang:1.18-alpine

# Environment variables
ENV GO111MODULE="on"
ENV GOOS="linux"
ENV CGO_ENABLED=0

# Expose ports
EXPOSE 8080
EXPOSE 2345

# Install delve and air so we can use them later
RUN go install github.com/go-delve/delve/cmd/dlv@latest && go install github.com/cosmtrek/air@latest

# Set our working directory
WORKDIR /disclone

# Copy mod file so we can install our dependencies in our layer
COPY go.mod ./

# Install our dependencies
RUN go mod download && go mod verify

# Copy our project
COPY . ./

ENTRYPOINT ["air"]
