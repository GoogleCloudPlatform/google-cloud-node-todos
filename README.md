gcloud-node-todos
=================

TodoMVC backend using [gcloud-node](//github.com/GoogleCloudPlatform/gcloud-node).

# Usage

- Insert a todo

    curl -X POST -d '{text: "do this"}' http://localhost:8080/todos

- Get a todo

    curl -X GET http://localhost:8080/todos/{{todo id}}

- Mark a todo as done

    curl -X POST -d '{text: "do this", "done": true}' http://localhost:8080/todos/{{todo id}}

- Delete a todo

    curl -X DELETE http://localhost:8080/todos/{{todo id}}

- Get all todos
 
    curl -X GET http://localhost:8080/todos

- Clear all `done` todos

    curl -X DELETE http://localhost:8080/todos

# Run locally

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
    docker run -p 8080:8080 app 

# Run w/ [Managed VMs](https://developers.google.com/appengine/docs/managed-vms/)

    # get gcloud
    curl https://sdk.cloud.google.com | bash
    # authorize gcloud and set your default project
    gcloud auth login
    gcloud config set project <project id>

    # get managed vms component
    gcloud components update app-engine-managed-vms

    # check that docker is running
    boot2docker up

    # run the app locally
    gcloud preview app run .

    # deploy the app to production
    gcloud preview app deploy .
