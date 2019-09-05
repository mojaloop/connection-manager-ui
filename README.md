# Connection Manager

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). See [local README](./README.CRA.md) for further info.

- [Connection Manager](#connection-manager)
  - [Coding Approach](#coding-approach)
    - [Versioning](#versioning)
    - [Code Changes](#code-changes)
  - [Docker](#docker)
    - [Build a local image](#build-a-local-image)
    - [Running a local image](#running-a-local-image)
    - [API location](#api-location)
    - [Production mode: Building an image and API location](#production-mode-building-an-image-and-api-location)
      - [Example](#example)
    - [Versioning with the git commit hash and package.json version](#versioning-with-the-git-commit-hash-and-packagejson-version)
    - [Full build](#full-build)
  - [Deploying Application](#deploying-application)
  - [Authentication](#authentication)

## Coding Approach

In order to keep coding quality and ensure the best development workflow, this project adopts some methodologies which should help tracking changes and preventing issues in production.

### Versioning

The correct way to create release it to use the completely automated `yarn version` command.

It will bump the version in `package.json` and create a tag. The tag is useful to track and create releases.

If you want to learn more about _yarn version_, read [here](https://yarnpkg.com/en/docs/cli/version).

:warning: **NOTE**
Using `yarn version` will also update the version of the Helm Chart to match the version supplied.

### Code Changes

We are adopting a PR based approach with _commits squash merge_. It helps to keep the history cleaner and to be _feature oriented_.

The general rule is to create a _pull request_ and only when marked as approved then bumping the version.

It needs to be done following the [versioning](#versioning) rules.

:warning: **Important notice**

It is really important to properly version every change and that the version change is the last commit in the PR. If further changes are done, then bump the version again. This will ensure that the _git tag_ (release) will be reference the right commit.

## Docker

The app can be run in a container. That is the current way it gets deployed in production.

### Build a local image

You can build this app as a docker container image containing a [Node.js Express server](./server/index.js) that will serve the production build of the app :rocket:

The image can be easily build with `docker build` as follows:

```bash
docker build -t connection-manager-ui:local .
```

### Running a local image

You can run the app container as follows:

```bash
docker run -p 8080:8080 connection-manager-ui:local
```

### API location

The app needs to access the API to handle all the operations it needs to perform on the backend.

By default the app will access the API at [http://localhost:3001](http://localhost:3001) which is useful while developing.

It will use the same protocol as the app is loaded from to avoid the `Mixed Content error`. Read more about [here](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content).

If the API is located on another URL, you can specify it by setting the value of either the [React App variable](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables) `REACT_APP_API_BASE_URL` or the regular env var `API_BASE_URL` used by the [bundled server](./server/index.js).

The API will be accesed at either `${REACT_APP_API_BASE_URL}/api` or `${API_BASE_URL}/api`.

Note that the value _must not end_ in '/'.

Using the `REACT_APP_API_BASE_URL` is useful when running locally, for example if the API is at localhost 3002, you can start the app with `REACT_APP_API_BASE_URL=http://localhost:3002 npm start`

### Production mode: Building an image and API location

If using `REACT_APP_API_BASE_URL`, the value must be set at build runtime, and it will be part of the build.

This means that if you build a docker image with this value, that image will always try to access the API on the defined URL.

Setting the API location using this option impedes using the same image for different environments like _dev_ or _uat_; using a regular env var is more flexible and the recommended way.

In order to build an image that can be used for different environments, you use the provided `Dockerfile` and set the value of the env var `API_BASE_URL` at runtime.

The bundled node server which serves the app production build, will also expose a `/config` endpoint that the app calls at boot time and which contains the value of the `API_BASE_URL` env var if set.

The `API_BASE_URL` var overrides the value of `REACT_APP_API_BASE_URL`.

#### Example

Let's say the app is published at [https://ui.example.com](https://ui.example.com); the sequence will be:

1) The browser load the app from `https://ui.example.com`. This will be served by the included node server in the container/pod.
2) The app will set the API location to the default value or the value of `REACT_APP_API_BASE_URL` if not null
3) The app will fetch `https://ui.example.com/config`. This will be served also by the included node server, and it will return the value of the env var `API_BASE_URL`
4) If the previous request returned a `API_BASE_URL` the app will use this as the API location.

### Versioning with the git commit hash and package.json version

The Connection Manager React App can include the version and commit hash the build uses.

The env variables responsible to add these values to the bundle are:

1) `REACT_APP_VERSION`
2) `REACT_APP_COMMIT`

You can set them as follows:

```bash
docker build \
--build-arg REACT_APP_VERSION=`cat package.json | grep version | sed -E 's/.*version": "([0-9\.]*)".*/\1/'` \
--build-arg REACT_APP_COMMIT=`git rev-parse HEAD` \
-t connection-manager-ui \
.
```

### Full build

```bash
docker build \
--build-arg REACT_APP_VERSION=`cat package.json | grep version | sed -E 's/.*version": "([0-9\.]*)".*/\1/'` \
--build-arg REACT_APP_COMMIT=`git rev-parse HEAD` \
-t connection-manager-ui \
.
```

## Deploying Application

Once a new version the UI is ready to deploy simply tag the commit with a string beginning with "h". e.g. `h1.3.20`. This will create and deploy the helm chart for this app. The version number used will match the version defined in [package.json](package.json).

## Authentication

Authentication is enabled by default in a production build and it cannot be disabled.

In dev mode it can be selectively enabled or disabled depending on the preference.
Simply open the browser console and run the commands

- To disable authentication `auth(false)`
- To enable authentication `auth(true)`

:warning: **NOTE**
It is suggested to clear local storage and cookies after enabling and disabling authentication. It will help starting a fresh session.
