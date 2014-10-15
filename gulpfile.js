'use strict';

var gulp = require('gulp');
var Dredd = require('dredd');
var jshint = require('gulp-jshint');

var server;

function startServer(cb) {
  if (server) {
    setImmediate(cb);
  } else {
    server = require('./server').listen(8080, cb);
  }
}

function stopServer(cb) {
  if (server) {
    server.close(function() {
      cb.apply(server, [].slice.call(arguments));
      server = null;
    });
  } else {
    setImmediate(cb);
  }
}

gulp.task('dredd', function(cb) {
  startServer(function() {
    new Dredd({
      blueprintPath: 'todos.apib',
      server: 'http://localhost:8080',
      options: {
        hookfiles: 'tests/hooks.js'
      }
    })
    .run(function() {
      stopServer(cb);
    });
  });
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!**/node_modules/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('serve', startServer);

gulp.task('test', ['dredd']);