gcloud-node-todos
=================

[![Build Status](https://travis-ci.org/proppy/gcloud-node-todos.svg?branch=master)](https://travis-ci.org/proppy/gcloud-node-todos)

TodoMVC backend using [gcloud-node](//github.com/GoogleCloudPlatform/gcloud-node).

# API

- Insert a todo

        curl -X POST -d '{text: "do this"}' http://localhost:8080/todos

- Get a todo

        curl -X GET http://localhost:8080/todos/{{todo id}}

- Mark a todo as done

        curl -X PUT -d '{text: "do this", "done": true}' http://localhost:8080/todos/{{todo id}}

- Delete a todo

        curl -X DELETE http://localhost:8080/todos/{{todo id}}

- Get all todos
 
        curl -X GET http://localhost:8080/todos

- Clear all `done` todos

        curl -X DELETE http://localhost:8080/todos

# Prerequisites

  - Create a new cloud project on [console.developers.google.com](http://console.developers.google.com)
  - [Enable](https://console.developers.google.com/flows/enableapi?apiid=datastore) the [Google Cloud Datastore API](https://developers.google.com/datastore)
  - Create a new service account and copy the `JSON` credentials to `key.json`
  - Export your project id
  
        export PROJECT_ID=<project id>

# Run locally

    # set your default dataset
    export DATASET_ID=$PROJECT_ID
    # fetch the dependencies
    npm install
    # start the app
    npm start
    # run acceptance test
    dredd todos.apib http://localhost:8080 --hookfiles test_hooks.js

# Run in docker

    # check that docker is running
    boot2docker up
    export DOCKER_HOST=$(boot2docker shellinit)

    # build your docker image
    docker build -t app .
    # start a new docker container
    docker run -e DATASET_ID=$PROJECT_ID -p 8080:8080 app 

    # test the app
    curl -X GET http://$(boot2docker ip):8080

# Run w/ [Managed VMs](https://developers.google.com/appengine/docs/managed-vms/)

    # get gcloud
    curl https://sdk.cloud.google.com | bash
    # authorize gcloud and set your default project
    gcloud auth login
    gcloud config set project $PROJECT_ID

    # get managed vms component
    gcloud components update app-engine-managed-vms

    # check that docker is running
    boot2docker up

    # run the app locally
    gcloud preview app run .
    curl -X GET http://localhost:8080

    # deploy the app to production
    gcloud preview app deploy .
    curl -X GET http://$PROJECT_ID.appspot.com
