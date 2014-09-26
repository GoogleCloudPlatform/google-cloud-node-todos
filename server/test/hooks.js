'use strict';

// imports the hooks module _injected_ by dredd.
var hooks = require('hooks');
var todos = require('../todos.js');

hooks.after('Todos > Todos Collection > Archive done Todos', function(transaction, done) {
  todos.getAll(function(err, items) {
    items.forEach(function(todo) {
      console.assert(!todo.done);
    });
    done();
  });
});

hooks.before('Todos > Todo > Get a Todo', function(transaction, done) {
  todos.insert({
    text: 'do that'
  }, function(err, todo) {
    transaction.fullPath = '/todos/' + todo.id;
    done();
  });
});

hooks.before('Todos > Todo > Delete a Todo', function(transaction, done) {
  todos.insert({
    text: 'delete me'
  }, function(err, todo) {
    transaction.fullPath = '/todos/' + todo.id;
    done();
  });
});

hooks.after('Todos > Todo > Delete a Todo', function(transaction, done) {
  var id = transaction.fullPath.split('/')[1];
  todos.get(id, function(err) {
    console.assert(err.code === 404);
    done();
  });
});

hooks.afterAll(function(done) {
  todos.getAll(function(err, items) {
    var deleted = 0;

    items.forEach(function(todo) {
      todos.delete(todo.id, function() {
        if (++deleted === items.length) {
          done();
        }
      });
    });
  });
});