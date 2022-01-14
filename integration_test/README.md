### E2E UI tests

#### Structure
We aim to use page models. These are a simple abstraction of the UI to reduce duplication in the
tests and speed UI and corresponding test refactoring. Not all tests use page models at the time of
writing, but all new tests should. The rule you should use is this: if you find yourself writing a
selector, you should instead use an existing page model (and extend it if necessary), or if none
exists for your current test, create a page model and place your selector there.

References for those unfamiliar with page models:
- https://testcafe.io/documentation/402826/guides/concepts/page-model#why-use-page-model
- https://github.com/SeleniumHQ/selenium/wiki/PageObjects
- https://martinfowler.com/bliki/PageObject.html

### Setup

#### Get a Kubernetes cluster

Kubernetes 1.17 to 1.21 should work. You'll probably want at least four cores and 8gb mem. This is
left as an exercise for the reader. Some suggestions:
1. [Minikube](https://minikube.sigs.k8s.io/docs/)
2. [k3d](https://k3d.io/)
3. [KinD](https://kind.sigs.k8s.io/docs/)
4. [DigitalOcean](https://www.digitalocean.com/products/kubernetes/)

#### Install application dependencies
You have two choices here: [with Nix](#with-nix) and [without Nix](#without-nix). The advantages of
using Nix here are:
1. Exactly the same versions of dependencies as CI, and other developers (except core system things
   like the kernel/container runtime).
2. Therefore, no need to track and manage dependency versions, simply run one command to get all
   required dependencies at the correct versions, and enter a shell with those dependencies.

##### With Nix
1. Install nix:
    ```sh
    curl -L https://nixos.org/nix/install | sh -s -- --no-daemon
    ```
    (From: https://nixos.org/manual/nix/stable/#sect-single-user-installation)
2. Navigate to the `integration_test` directory of this project
3. Run `nix-shell` to be dropped into a shell containing all necessary dependencies

##### Without Nix
Install the following:
- Google Chrome (it's possible to use another browser, see [run tests with a different browser](#with-a-different-browser))
- Skaffold v1.28.0 or greater: https://github.com/GoogleContainerTools/skaffold/releases
- Kustomize v4.0.5 or greater: https://github.com/kubernetes-sigs/kustomize/releases
- A recent version of kubectl

#### Deploy Mojaloop and dependencies to cluster
In the project root:
```sh
skaffold run -p backend
```
You'll need to wait a few minutes until the wso2is-populate job has completed. You can view its status
with:
```sh
kubectl get jobs
```
When it's completed, it'll look like this:
```
NAME              COMPLETIONS   DURATION   AGE
wso2is-populate   1/1           2m35s      6h26m
```
Specifically, `COMPLETIONS` will be `1/1`

#### Port-forward the ingress and support service
```sh
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8000:80
kubectl port-forward voodoo-doll 3030
```

#### Build and run the portal
From the project root:
```sh
yarn install
yarn start
```

#### Install integration test npm dependencies
In the `integration_test/tests` directory:
```sh
npm ci
```

### Run tests
In the `integration_test/tests` directory:
```sh
npm run test
```

#### View results
In the `integration_test/tests` directory:
```sh
$BROWSER results.html
```

#### Run a single test
```sh
npm run test -- -t 'name of test'
```
E.g., for one of the login tests:
```sh
npm run test -- -t 'Log in with valid credentials'
```

#### With a different browser
```sh
BROWSER_TCAFE=chromium npm run test
# or
BROWSER_TCAFE=firefox npm run test
```

### Clean up
In the project root:
```sh
skaffold delete -p backend
```
