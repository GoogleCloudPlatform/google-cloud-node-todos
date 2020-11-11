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

const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

datastore.auth.getProjectId((err, projectId) => {
  if (err) {
    console.error('Error detecting current project.')
    console.error(err)
  }
  console.log(`Using project ${projectId}`)
})

const LIST_NAME = 'default-list'

function entityToTodo (entity) {
  const key = entity[datastore.KEY]

  entity.id = key.name || key.id
  return entity
}

function saveTodo (key, data, callback) {
  delete data.id

  datastore.save({
    key: key,
    data: data
  }, function (err) {
    if (err) {
      callback(err)
      return
    }

    data.id = key.id
    callback(null, data)
  })
}

module.exports = {
  delete: function (id, callback) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo', id])

    datastore.delete(key, function (err) {
      callback(err || null)
    })
  },

  deleteCompleted: function (callback) {
    const transaction = datastore.transaction()

    transaction.run(function (err, transaction) {
      if (err) {
        console.error(err)
      }
      const query = transaction.createQuery('Todo')
        .hasAncestor(datastore.key(['TodoList', LIST_NAME]))
        .filter('completed', true)

      query.run(function (err, items) {
        if (err) {
          transaction.rollback(callback)
          return
        }

        transaction.delete(items.map(function (todo) {
          return todo.key
        }))

        transaction.commit(callback)
      })
    })
  },

  get: function (id, callback) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo', id])

    datastore.get(key, function (err, item) {
      if (err) {
        callback(err)
        return
      }

      if (!item) {
        callback({ // eslint-disable-line
          code: 404,
          message: 'No matching entity was found.'
        })
        return
      }

      callback(null, entityToTodo(item))
    })
  },

  getAll: function (callback) {
    const query = datastore.createQuery('Todo')
      .hasAncestor(datastore.key(['TodoList', LIST_NAME]))

    query.run(function (err, items) {
      if (err) {
        callback(err)
        return
      }

      callback(null, items.map(entityToTodo))
    })
  },

  insert: function (data, callback) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo'])

    data.completed = false

    saveTodo(key, data, callback)
  },

  update: function (id, data, callback) {
    const key = datastore.key(['TodoList', LIST_NAME, 'Todo', id])

    saveTodo(key, data, callback)
  }
}
