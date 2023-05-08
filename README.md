
# Mabills

This is a web application to manage bills and get some statistics.
It was build with Mongo, Express, Angular and NodeJs.


## Find in the Web

This project is hosted in [Mabills](https://lambent-moxie-2d38f8.netlify.app/)

## Stack used

**Front-end:** Angular

**Back-end:** Node, Express, MongoDB


## Install and Run Locally

Clone the project

```bash
  git clone git@github.com:lazarobodevan/Mabills.git
```

Access each frontend and backend directories and install dependencies

```bash
  npm install
```

Install Angular-CLI

```bash
  npm install -g @angular/cli
```

Go to the backend directory, rename the DEV.env.example to DEV.env and setup the environment variables. After this, install  [MongoDB Atlas](https://www.mongodb.com/try/download/community) and create a database called "testdb". Then, run:

```bash
  npm run dev
```

Go to the frontend directory and run:

```bash
  ng serve
```

## Running tests

To run the backend tests, go to this directory and run:

```bash
  npm test
```

To run the frontend tests, ensure that you have Node v16.13.2 and that the server is running, go to the frontend directory and then run:

```bash
  ng e2e
```

## API Documentation

You can find the API documentation in [Postman Doc](https://documenter.getpostman.com/view/16703933/2s93eYUCDn#b3d15384-a235-4028-ad3e-4324b0eb8326)

