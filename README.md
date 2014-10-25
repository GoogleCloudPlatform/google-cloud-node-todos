# gcloud-node-todos
>  [TodoMVC](http://todomvc.com) backend using [gcloud-node](//github.com/GoogleCloudPlatform/gcloud-node).

[![Build Status](https://travis-ci.org/GoogleCloudPlatform/gcloud-node-todos.svg?branch=master)](https://travis-ci.org/GoogleCloudPlatform/gcloud-node-todos)

## API

#### Insert a todo
```sh
$ curl -X POST -H "Content-Type: application/json" -d '{"text": "do this"}' http://localhost:8080/todos
```

#### Get a todo
```sh
$ curl -X GET http://localhost:8080/todos/{{todo id}}
```

#### Mark a todo as done
```sh
$ curl -X PUT -H "Content-Type: application/json" -d '{"text": "do this", "done": true}' http://localhost:8080/todos/{{todo id}}
```

#### Delete a todo
```sh
$ curl -X DELETE http://localhost:8080/todos/{{todo id}}
```

#### Get all todos
```sh
$ curl -X GET http://localhost:8080/todos
```

#### Clear all `done` todos
```sh
$ curl -X DELETE http://localhost:8080/todos
```

## Prerequisites

1. Create a new cloud project on [console.developers.google.com](http://console.developers.google.com)
2. [Enable](https://console.developers.google.com/flows/enableapi?apiid=datastore) the [Google Cloud Datastore API](https://developers.google.com/datastore)
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

# Run acceptance test
$ npm test
```

#### [Docker](https://docker.com)
```sh
# Check that Docker is running
$ boot2docker up
$ export DOCKER_HOST=$(boot2docker shellinit)

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

# Get Managed VMs component
$ gcloud components update app-engine-managed-vms

# Check that Docker is running
$ boot2docker up

# Run the app locally
$ gcloud preview app run .
$ curl -X GET http://localhost:8080

# Deploy the app to production
$ gcloud preview app deploy .
$ curl -X GET http://$PROJECT_ID.appspot.com
```

## Other Examples

- [Command Line](//github.com/GoogleCloudPlatform/gcloud-node-todos/tree/master/cli)
