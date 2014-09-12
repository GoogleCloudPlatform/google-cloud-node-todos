var request = require('request');
// imports the hooks module _injected_ by dredd.
var hooks = require('hooks');

hooks.before('Todos > Todo > Get a Todo', function(transaction, done) {
  request.post({
    uri: 'http://localhost:8080/todos',
    json: {'text': 'do that'}
  }, function(err, res, todo) {
    transaction.fullPath = '/todos/' + todo.id;
    return done();
  });
});

hooks.before('Todos > Todo > Delete a Todo', function(transaction, done) {
  request.post({
    uri: 'http://localhost:8080/todos',
    json: {'text': 'delete me'}
  }, function(err, res, todo) {
    transaction.fullPath = '/todos/' + todo.id;
    return done();
  });
});

hooks.after('Todos > Todo > Delete a Todo', function(transaction, done) {
  request.get({
    uri: 'http://localhost:8080' + transaction.fullPath,
  }, function(err, res, body) {
    console.assert(res.statusCode == 404);
    return done();
  });
});

hooks.after('Todos > Todos Collection > Archive done Todos', function(transaction, done) {
  request.get({
    uri: 'http://localhost:8080/todos'
  }, function(err, res, body) {
    JSON.parse(body).forEach(function(todo) {
      console.assert(!todo.done);
    });
    return done();
  });
});
