var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();  

var gcloud = require('gcloud'),
    datastore = gcloud.datastore;

var ds = new datastore.Dataset({
  projectId: process.env.GAE_LONG_APP_ID || process.env.DATASET_ID,
  keyFilename: 'key.json'
});

app.use(bodyParser.json());

var todoListName = 'default-list';

app.get('/', function(req, res) {
  res.send(200, 'hello world');
});

app.get('/todos', function(req, res) {
  var q = ds.createQuery('Todo')
    .hasAncestor(ds.key('TodoList', todoListName));
  ds.runQuery(q, function(err, items) {
    if (err) {
      console.error(err)
      res.status(500).send(err.message);
      return;
    }
    res.json(items.map(function(obj, i) {
      obj.data.id = obj.key.path_.pop();
      return obj.data;
    }));
  });
});

app.get('/todos/:id', function(req, res) {
  var id = req.param('id');
  ds.get(ds.key('TodoList', todoListName, 'Todo', id), function(err, obj) {
    if (err) {
      console.error(err)
      res.status(500).send(err.message);
      return;
    }
    if (!obj) {
      return res.send(404);
    }
    obj.data.id = obj.key.path_.pop();
    res.json(obj.data);
  });
});

app.post('/todos', function(req, res) {
  var todo = req.body;
  ds.save({
    key: ds.key('TodoList', todoListName, 'Todo'),
    data: todo
  }, function(err, key) {
    if (err) {
      console.error(err)
      res.status(500).send(err.message);
      return;
    }
    todo.id = key.path_.pop();
    res.json(todo);
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
      console.error(err)
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
      console.error(err)
      res.status(500).send(err.message);
      return;
    }
    res.send(200);
  });
});

app.delete('/todos', function(req, res) {
  ds.runInTransaction(function(t, done) {
    var q = ds.createQuery('Todo')
      .hasAncestor(ds.key('TodoList', todoListName))
      .filter('completed =', true);
    t.runQuery(q, function(err, items) {
      if (err) {
        t.rollback(done);
        console.error(err)
        res.status(500).send(err.message);
        return;
      }     
      var keys = items.map(function(obj) {
        return obj.key;
      });
      t.delete(keys, function(err) {
        if (err) {
          t.rollback(done);
          console.error(err)
          res.status(500).send(err.message);
          return;
        }
        done();
        res.send(200);
      });
    });
  });
});

app.listen(8080);
