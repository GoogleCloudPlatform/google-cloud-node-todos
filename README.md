# gcloud-node-todos
> [TodoMVC][todomvc] backend using [gcloud-node][gcloud-node].

[![Build Status](https://travis-ci.org/GoogleCloudPlatform/gcloud-node-todos.svg?branch=master)](https://travis-ci.org/GoogleCloudPlatform/gcloud-node-todos)

## Install

1. Clone this repo and cd into it:

    ```sh
    $ git clone git@github.com:GoogleCloudPlatform/gcloud-node-todos.git
    $ cd gcloud-node-todos
    ```

2. Create a new cloud project on [console.developers.google.com][dev-console]
3. [Enable][enable-datastore] the [Google Cloud Datastore API][datastore]
4. Create a new service account and copy the JSON credentials to `key.json`
5. Export your project id:

    ```sh
    $ export PROJECT_ID=<project id>
    ```

## Usage

#### Run locally
```sh
# Set your default Dataset
$ export DATASET_ID=$PROJECT_ID

# Install the dependencies
$ npm install

# Start the server
$ npm start
```

Point your browser at http://127.0.0.1:8080

#### Run with [Docker][docker]
```sh
# Check that Docker is running
$ boot2docker up
$ export DOCKER_HOST=$(boot2docker shellinit)

# Build your Docker image
$ docker build -t app .

# Start a new Docker container
$ docker run -e DATASET_ID=$PROJECT_ID -p 8080:8080 app

# Test the app
$ curl -L http://$(boot2docker ip):8080

# Print out local address to test in your browser
$ echo http://$(boot2docker ip):8080
```

#### Run on [Managed VMs][managed-vms]
```sh
# Get gcloud
$ curl https://sdk.cloud.google.com | bash

# Authorize gcloud and set your default project
$ gcloud auth login
$ gcloud config set project $PROJECT_ID

# Get App Engine component
$ gcloud components update app

# Download App Engine Docker Runtime images for Managed VMs
$ gcloud preview app setup-managed-vms

# Check that Docker is running
$ boot2docker up

# Download the Node.js Docker image
$ docker pull google/nodejs-runtime

# Run the app locally
$ gcloud preview app run .
$ curl -X GET http://localhost:8080

# Deploy the app to production
$ gcloud preview app deploy .
```

After deployment, your app should be available at `http://1.$PROJECT_ID.appspot.com`

## Resources

- [Command Line Example][cli]
- [Node.js on the Google Cloud Platform][node-gcp]

## License

[Apache License 2.0][license]

[todomvc]: http://todomvc.com
[gcloud-node]: https://github.com/GoogleCloudPlatform/gcloud-node
[dev-console]: https://console.developers.google.com
[enable-datastore]: https://console.developers.google.com/flows/enableapi?apiid=datastore
[datastore]: https://cloud.google.com/datastore/
[docker]: https://docker.com
[managed-vms]: https://developers.google.com/appengine/docs/managed-vms/
[cli]: https://github.com/GoogleCloudPlatform/gcloud-node-todos/tree/master/cli
[node-gcp]: https://cloud.google.com/solutions/nodejs
[license]: LICENSE
