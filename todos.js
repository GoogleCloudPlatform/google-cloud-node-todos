'use strict';

var projectId = process.env.GAE_LONG_APP_ID || process.env.DATASET_ID;

if (!projectId) {
  var MISSING_ID = [
    'Cannot find your project ID. Please set an environment variable named ',
    '"DATASET_ID", holding the ID of your project.'
  ].join('');
  throw new Error(MISSING_ID);
}

var datastore = require('@google-cloud/datastore')({
  projectId: projectId,
  credentials: require('./key.json')
});

var LIST_NAME = 'default-list';

function entityToTodo(entity) {
  var key = entity[datastore.KEY];

  entity.id = key.name || key.id;
  return entity;
}

function saveTodo(key, data, callback) {
  delete data.id;

  datastore.save({
    key: key,
    data: data
  }, function(err) {
    if (err) {
      callback(err);
      return;
    }

    data.id = key.id;
    callback(null, data);
  });
}

module.exports = {
  delete: function(id, callback) {
    var key = datastore.key(['TodoList', LIST_NAME, 'Todo', id]);

    datastore.delete(key, function(err) {
      callback(err || null);
    });
  },

  deleteCompleted: function(callback) {
    var transaction = datastore.transaction();

    transaction.run(function(err, transaction) {
      var query = transaction.createQuery('Todo')
        .hasAncestor(datastore.key(['TodoList', LIST_NAME]))
        .filter('completed', true);

      query.run(function(err, items) {
        if (err) {
          transaction.rollback(done);
          return;
        }

        transaction.delete(items.map(function(todo) {
          return todo.key;
        }));

        transaction.commit(callback);
      });
    });
  },

  get: function(id, callback) {
    var key = datastore.key(['TodoList', LIST_NAME, 'Todo', id]);

    datastore.get(key, function(err, item) {
      if (err) {
        callback(err);
        return;
      }

      if (!item) {
        callback({
          code: 404,
          message: 'No matching entity was found.'
        });
        return;
      }

      callback(null, entityToTodo(item));
    });
  },

  getAll: function(callback) {
    var query = datastore.createQuery('Todo')
      .hasAncestor(datastore.key(['TodoList', LIST_NAME]));

    query.run(function(err, items) {
      if (err) {
        callback(err);
        return;
      }

      callback(null, items.map(entityToTodo));
    });
  },

  insert: function(data, callback) {
    var key = datastore.key(['TodoList', LIST_NAME, 'Todo']);

    data.completed = false;

    saveTodo(key, data, callback);
  },

  update: function(id, data, callback) {
    var key = datastore.key(['TodoList', LIST_NAME, 'Todo', id]);

    saveTodo(key, data, callback);
  }
};