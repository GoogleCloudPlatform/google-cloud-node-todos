'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var markdown = require('markdown').markdown;

var css = require.resolve('./node_modules/github-markdown-css/github-markdown.css');
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
      '  <body><article class="markdown-body">' + markdown.toHTML(todosAPIBlueprint) + '</article></body>',
      '</html>'
    ].join('\n'));
});

app.get('/todos', function(req, res) {
  todos.getAll(_handleApiResponse(res));
});

app.get('/todos/:id', function(req, res) {
  todos.get(req.param('id'), _handleApiResponse(res));
});

app.post('/todos', function(req, res) {
  todos.insert(req.body, _handleApiResponse(res, 201));
});

app.put('/todos/:id', function(req, res) {
  todos.update(req.param('id'), req.body, _handleApiResponse(res));
});

app.delete('/todos', function(req, res) {
  todos.deleteCompleted(_handleApiResponse(res, 204));
});

app.delete('/todos/:id', function(req, res) {
  todos.delete(req.param('id'), _handleApiResponse(res, 204));
});

function _handleApiResponse(res, successStatus) {
  return function(err, payload) {
    if (err) {
      console.error(err);
      res.status(err.code).send(err.message);
      return;
    }
    if (successStatus) {
      res.status(successStatus);
    }
    res.json(payload);
  };
}
