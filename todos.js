var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    markdown = require('markdown').markdown,
    async = require('async');
    app = express();  

var gcloud = require('gcloud'),
    datastore = gcloud.datastore;

var ds = new datastore.Dataset({
  projectId: process.env.GAE_LONG_APP_ID || process.env.DATASET_ID,
  keyFilename: 'key.json'
});

app.use(bodyParser.json());

var todoListName = 'default-list';

app.get('/todos', function(req, res) {
  var q = ds.createQuery('Todo')
    .hasAncestor(ds.key('TodoList', todoListName));
  ds.runQuery(q, function(err, items) {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    res.json(items.map(function(obj, i) {
      obj.data.id = obj.key.path.pop();
      return obj.data;
    }));
  });
});

app.get('/todos/:id', function(req, res) {
  var id = req.param('id');
  ds.get(ds.key('TodoList', todoListName, 'Todo', id), function(err, obj) {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    if (!obj) {
      return res.status(404).send();
    }
    obj.data.id = obj.key.path.pop();
    res.json(obj.data);
  });
});

app.post('/todos', function(req, res) {
  var todo = req.body;
  todo.done = false;
  ds.save({
    key: ds.key('TodoList', todoListName, 'Todo'),
    data: todo
  }, function(err, key) {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    todo.id = key.path.pop();
    res.status(201).json(todo);
  });    
});

app.put('/todos/:id', function(req, res) {
  var id = req.param('id');
  var todo = req.body;
  ds.save({
    key: ds.key('TodoList', todoListName, 'Todo', id),
    data: todo
  }, function(err, key) {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    todo.id = id;
    res.json(todo);
  });
});

app.delete('/todos/:id', function(req, res) {
  var id = req.param('id');
  ds.delete(ds.key('TodoList', todoListName, 'Todo', id), function(err) {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    res.status(204).send();
  });
});

app.delete('/todos', function(req, res) {
  ds.runInTransaction(function(t, done) {
    var q = ds.createQuery('Todo')
      .hasAncestor(ds.key('TodoList', todoListName))
      .filter('done =', true);
    t.runQuery(q, function(err, items) {
      if (err) {
        t.rollback(done);
        console.error(err);
        res.status(500).send(err.message);
        return;
      }     
      var keys = items.map(function(obj) {
        return obj.key;
      });
      t.delete(keys, function(err) {
        if (err) {
          t.rollback(done);
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        done();
        res.status(204).send();
      });
    });
  });
});

var githubMarkdownCSS = 'node_modules/github-markdown-css/github-markdown.css';
var todosAPIBlueprint = 'todos.apib';
app.get('/', function(req, res) {
  async.parallel([
    function(callback) { fs.readFile(githubMarkdownCSS, callback); },
    function(callback) { fs.readFile(todosAPIBlueprint, callback); },
  ], function(err, results) {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    res.status(200)
       .set('Content-Type', 'text/html')
       .send('<html><head><style>'+
             results[0].toString()+
             '</style></head><body class="markdown-body">'+
             markdown.toHTML(results[1].toString())+
             '</body></html>');
  });
});

module.exports = app;
