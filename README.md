# gcloud-node-todos
> [TodoMVC](http://todomvc.com) backend using [gcloud-node](//github.com/GoogleCloudPlatform/gcloud-node).

[![Build Status](https://travis-ci.org/GoogleCloudPlatform/gcloud-node-todos.svg?branch=master)](https://travis-ci.org/GoogleCloudPlatform/gcloud-node-todos)

## Prerequisites

1. Create a new cloud project on [console.developers.google.com](http://console.developers.google.com)
2. [Enable the Google Cloud Datastore API](https://console.developers.google.com/flows/enableapi?apiid=datastore). For more information about the Cloud Datastore, see [here](https://developers.google.com/datastore).
3. Create a new service account and copy the JSON credentials to `key.json`
4. Export your project id:

    ```sh
    $ export PROJECT_ID=<project id>
    ```

## Running

#### Locally
```sh
# Set your default Dataset
$ export DATASET_ID=$PROJECT_ID

# Install the dependencies
$ npm install

# Start the server
$ npm start
```

#### [Docker](https://docker.com)
```sh
# Check that Docker is running
$ boot2docker up
$ $(boot2docker shellinit)

# Build your Docker image
$ docker build -t app .

# Start a new Docker container
$ docker run -e DATASET_ID=$PROJECT_ID -p 8080:8080 app

# Test the app
$ curl -X GET http://$(boot2docker ip):8080
```

#### [Managed VMs](https://developers.google.com/appengine/docs/managed-vms/)
```sh
# Get gcloud
$ curl https://sdk.cloud.google.com | bash

# Authorize gcloud and set your default project
$ gcloud auth login
$ gcloud config set project $PROJECT_ID

# Get App Engine component
$ gcloud components update app

# Check that Docker is running
$ boot2docker up

# Download the Node.js Docker image
$ docker pull google/nodejs-runtime

# Run the app locally
$ gcloud preview app run .
$ curl -X GET http://localhost:8080

# Deploy the app to production
$ gcloud preview app deploy .
$ curl -X GET http://$PROJECT_ID.appspot.com
```

## Resources

- [Command Line Example](//github.com/GoogleCloudPlatform/gcloud-node-todos/tree/master/cli)
- [Node.js on the Google Cloud Platform](//cloud.google.com/solutions/nodejs)
