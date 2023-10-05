# AS: dev
FROM oven/bun:debian

WORKDIR /ds_auth

# HTTP Port
EXPOSE 4020

COPY bun.lockb package.json /ds_auth/

RUN bun install

COPY . /ds_auth

CMD ["bun", "start"]
