# Disclaimer on Contributing to this project

This is not a project that will be used by thousands, this is not a project that will be used by many.
If you are wanting to contribute it is because you are in one of the following pools:

1. You want to learn how to build using the technologies used in this project
2. You want to learn about system design and architecture
3. You are new to OSS and want to learn how to work in a bigger ecosystem and collaborate with other devs
4. You want to be able to showcase your work to future employers

This project will be deployed and managed by me. Your code will make it into the real world and people will be able to
see it, use it
and interact with it. This is a great way to showcase your work and get your name out there.

You will be able to help guide features and make suggestions and I will genuinely listen to them.

So let's make it fun!

## Getting Started

Make sure you have got everything up and running locally. If you have not check out the [README.md](./README.md) for
more information.

## Contributing

Each story, bug, feature will and should be prepended with what part of the system it affects. If it is multiple then add commas.
If it is all then add **ALL**.

Create your fork and then check below:

**Stories:**

There are going to be stories under the [issues](https://github.com/codewith-luke/disclone/issues).
Simply look at a story, see if someone is working on it, if someone already is, ask to collab and see if they want to.
This may not always be the case but go for it and try.

I will tag stories with `difficulty` and `priority` so you can see what is important and what is not.

**Bugs:**

If you find bugs, log an issue, if you want to fix it, log an issue and then fix it. Then raise a PR.

**Features:**
I am not going to be taking feature requests at this time. I want to build the core of the application and then we can.

Make sure to check out the [discord](https://discord.gg/46JKsxmSRJ) and ask questions if you have any.

### How to effectively contribute

**Security :**

to remove sensitive files or leaked data from git, please check the following resources :
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository,
https://www.baeldung.com/git-remove-file-without-deleting-it,
https://www.baeldung.com/git-remove-file-commit-history

if anything, don't panic, contact your Security Officer or repositories' owners.

**Running the tests :**

.env files that don't have a .example extension must have been created for your local setup, duplicate the example ones.
Note: since coruscant_db binds to 0.0.0.0:5432, having a local install of PostgreSQL will clash with it.

Please run the tests locally on your machine before opening a Pull Request.
To run the test
at root level
```shell
docker compose up -d
```
inside "disclone/apps/ds_auth" run 
```shell
cd apps/ds_auth
bun run test
```

**Requirements :**

though not required, we recommend to install [proto](https://moonrepo.dev/docs/proto/install) and [moonrepo](https://moonrepo.dev/docs)

Need to have installed on your machine: Docker, [Bun](https://bun.sh), [pnpm](https://pnpm.io/installation), 
and Go 1.21.0 installed with either [proto](https://moonrepo.dev/docs/proto/tools) or [official go docs](https://go.dev/doc/install)

Not sure: you may need versions of NodeJS for sveltekit and sveltekit installations scripts that rely on it

**Steps :**

1. Fork the repo
2. take an issue and notify that you're working on it OR log an issue and then fix it
3. git clone your fork
```shell
git clone git@github.com:<yourUsernameGoesHere>/disclone.git
```
- if you already forked the repo, sync your fork with main and do 'git pull' to be sure to be up-to-date 


```shell
git pull
```
and to install dependencies
- at root level run :
```shell
pnpm install
```

- inside "disclone/apps/ds_auth", run 

 ```shell
 bun install
 ``` 


4. Create your working branch : git branch fix/<"insert here number of the issue you fix"> or feat/<"name of the feat">

   ( let's say it's fix/420 )
```shell
git branch fix/420
```

5.  Go onto your working branch : git switch fix/420

```shell
git switch fix/420
```

- work on your branch

- when done => review yourself => remove console.logs

6. Add and Save your modifications :
git add <"files affected"> or git add -A

```shell
git add -A
git commit -m "insert some meaningful message here"
```
7. Save work to your remote (GitHub) branch 

```shell
git push --set-upstream origin fix/420
```

8. go to your forked repo and open a pull request
9. write some edgy mean derogatory comment, so we know what the Pull Request is about
10. Click 'Create pull request'
11. Done ! Write "OpenSource Core team contributor" on your resume
