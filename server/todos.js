'use strict';

var projectId = process.env.GAE_LONG_APP_ID || process.env.DATASET_ID;

if (!projectId) {
  var MISSING_ID = [
    'Cannot find your project ID. Please set an environment variable named ',
    '"DATASET_ID", holding the ID of your project.'
  ].join('');
  throw new Error(MISSING_ID);
}

var gcloud = require('gcloud')({
  projectId: projectId,
  credentials: require('../key.json')
});

var ds = gcloud.datastore.dataset();
var LIST_NAME = 'default-list';

function formatTodo(item) {
  var todo = item.data;
  todo.id = item.key.path.pop();
  return todo;
}

module.exports = {
  delete: function(id, callback) {
    ds.delete(ds.key(['TodoList', LIST_NAME, 'Todo', id]), function(err) {
      callback(err || null);
    });
  },

  deleteCompleted: function(callback) {
    ds.runInTransaction(function(transaction, done) {
      var q = ds.createQuery('Todo')
        .hasAncestor(ds.key(['TodoList', LIST_NAME]))
        .filter('done =', true);
      transaction.runQuery(q, function(err, items) {
        if (err) {
          transaction.rollback(done);
          return;
        }
        var keys = items.map(function(todo) {
          return todo.key;
        });
        transaction.delete(keys, function(err) {
          if (err) {
            transaction.rollback(done);
            return;
          }
          done();
        });
      });
    }, callback);
  },

  get: function(id, callback) {
    ds.get(ds.key(['TodoList', LIST_NAME, 'Todo', id]), function(err, item) {
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
      callback(null, formatTodo(item));
    });
  },

  getAll: function(callback) {
    var q = ds.createQuery('Todo')
      .hasAncestor(ds.key(['TodoList', LIST_NAME]));
    ds.runQuery(q, function(err, items) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, items.map(formatTodo));
    });
  },

  insert: function(data, callback) {
    data.done = false;
    ds.save({
      key: ds.key(['TodoList', LIST_NAME, 'Todo']),
      data: data
    }, function(err, key) {
      if (err) {
        callback(err);
        return;
      }
      data.id = key.path.pop();
      callback(null, data);
    });
  },

  update: function(id, data, callback) {
    ds.save({
      key: ds.key(['TodoList', LIST_NAME, 'Todo', id]),
      data: data
    }, function(err) {
      if (err) {
        callback(err);
        return;
      }
      data.id = id;
      callback(null, data);
    });
  }
};