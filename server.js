// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const todomvc = require('todomvc')
const todomvcApi = require('todomvc-api')

const todos = require('./todos.js')

const app = module.exports.app = express()
const api = module.exports.api = express()
api.use(bodyParser.json())
app.use('/api', [todomvcApi.server, api])

// Declare the root route *before* inserting TodoMVC as middleware to prevent
// the TodoMVC app from overriding it.
app.get('/', function (req, res) {
  res.redirect('/examples/angularjs')
})
app.use(todomvc)

// Respond to the App Engine health check
app.get('/_ah/health', function (req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok')
})

// API Routes.
api.get('/', function (req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok')
})

api.get('/todos', function (req, res) {
  todos.getAll(_handleApiResponse(res))
})

api.get('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id, 10)
  todos.get(id, _handleApiResponse(res))
})

api.post('/todos', function (req, res) {
  todos.insert(req.body, _handleApiResponse(res, 201))
})

api.put('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id, 10)
  todos.update(id, req.body, _handleApiResponse(res))
})

api.delete('/todos', function (req, res) {
  todos.deleteCompleted(_handleApiResponse(res, 204))
})

api.delete('/todos/:id', function (req, res) {
  const id = parseInt(req.params.id, 10)
  todos.delete(id, _handleApiResponse(res, 204))
})

function _handleApiResponse (res, successStatus) {
  return function (err, payload) {
    if (err) {
      console.error(err)
      res.status(err.code).send(err.message)
      return
    }
    if (successStatus) {
      res.status(successStatus)
    }
    res.json(payload)
  }
}

// Configure the sidebar to display relevant links for our hosted version of TodoMVC.
todomvc.learnJson = {
  name: 'Google Cloud Platform',
  description: 'Google Cloud Platform is now available via Node.js with google-cloud-node.',
  homepage: 'http://cloud.google.com/solutions/nodejs',
  examples: [
    {
      name: 'google-cloud-node + Express',
      url: 'https://github.com/GoogleCloudPlatform/gcloud-node-todos'
    }
  ],
  link_groups: [
    {
      heading: 'Official Resources',
      links: [
        {
          name: 'google-cloud-node',
          url: 'https://github.com/GoogleCloudPlatform/google-cloud-node'
        },
        {
          name: 'Google Cloud Datastore',
          url: 'https://cloud.google.com/datastore/docs'
        }
      ]
    },
    {
      heading: 'Community',
      links: [
        {
          name: 'google-cloud-node on Stack Overflow',
          url: 'http://stackoverflow.com/questions/tagged/google-cloud-node'
        }
      ]
    }
  ]
}
