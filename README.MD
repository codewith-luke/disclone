# What is Disclone?

Disclone is an OSS chat application built by [codingWithLuke](https://www.twitch.tv/codingwithluke) and the community.

### The Goal

The goal of the project is not necessarily to have everything done perfectly or to have everything be exactly correct.
It is also not to build a production ready application. It is an experiment. An experiment to learn and grow.
This means we have a bunch of tools and tech I want to try and learn, as well as system design and architecture.
The application is about building a distributed system. While not going to over board with microservices, but just
enough granularity where it matters.

To get a wider understanding of learning and changes make sure to check
out [The Vault](https://github.com/codewith-luke/the-vault) where I keep all my notes and our learnings.

### Technologies

The project uses a number of technologies (if the project does not have the specified it will in future):

**Languages:**

- Go
- Typescript
- C#

**Tools:**

- Tauri
- Sveltekit
- ElysiaJS
- Bun
- Docker
- NGINX
- Grafana

**Infra:**

- AWS CDK

## Getting Started (*Disclaimer*, if stuff goes wrong here. Message me.)

To run the repo locally just follow along:

1. Clone down
2. Install docker if you do not have it already
3. (Optional) - It is not required but the application is a mono repo that is managed
   with [moon repo](https://moonrepo.dev/)
4. `pnpm i`
5. Create .env.development file in `./db` and `./apps/ds_auth`. You can just copy the example one and rename/fill out
   what you want.
4. `docker compose up -d`
5. `moon run client:dev`
6. This should now open the client and have everything up and running
7. You can login to the app with the default account `u: admin` `p: admin` (very secure)

## Contributing

Check out the [contributing](./CONTRIBUTING.md) guide for more information.

