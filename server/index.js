'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var markdown = require('markdown').markdown;

var css = require.resolve('../node_modules/github-markdown-css/github-markdown.css');
var apib = require.resolve('./todos.apib');
var githubMarkdownCSS = fs.readFileSync(css).toString();
var todosAPIBlueprint = fs.readFileSync(apib).toString();

var todos = require('./todos.js');

var app = module.exports = express();
app.use(bodyParser.json());

app.get('/_ah/health', function(req, res) {
  res.status(200)
     .set('Content-Type', 'text/plain')
     .send('ok');
});

app.get('/', function(req, res) {
  res.status(200)
    .set('Content-Type', 'text/html')
    .send([
      '<html>',
      '  <head>',
      '    <style>' + githubMarkdownCSS + '</style>',
      '  </head>',
      '  <body class="markdown-body">' + markdown.toHTML(todosAPIBlueprint) + '</body>',
      '</html>'
    ].join('\n'));
});

app.get('/todos', function(req, res) {
  todos.getAll(_handleResponse(res));
});

app.get('/todos/:id', function(req, res) {
  todos.get(req.param('id'), _handleResponse(res));
});

app.post('/todos', function(req, res) {
  todos.insert(req.body, _handleResponse(res, 201));
});

app.put('/todos/:id', function(req, res) {
  todos.update(req.param('id'), req.body, _handleResponse(res));
});

app.delete('/todos', function(req, res) {
  todos.deleteCompleted(_handleResponse(res, 204));
});

app.delete('/todos/:id', function(req, res) {
  todos.delete(req.param('id'), _handleResponse(res, 204));
});

function _handleResponse(res, successStatus) {
  return function(err, response) {
    if (err) {
      console.error(err);
      res.status(err.code).send(err.message);
      return;
    }
    if (successStatus) {
      res.status(successStatus);
    }
    res.json(response);
  };
}
