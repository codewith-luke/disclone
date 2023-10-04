FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src/ ./src

RUN bun install

CMD ["bun", "start"]