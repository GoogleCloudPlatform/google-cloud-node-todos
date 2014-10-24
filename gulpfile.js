'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var todomvcApi = require('todomvc-api');

var apiServer = require('./server').api;
var todomvcServer = require('./server').todomvc;

gulp.task('validate-api', function(cb) {
  var server = apiServer.listen(8080, function() {
    todomvcApi.validate(function(err, stats) {
      server.close(function() {
        if (stats && (stats.errors || stats.failures)) {
          cb('api validation failed');
          return;
        }
        cb(err && err.message || err);
      });
    });
  });
});

gulp.task('lint', function() {
  return gulp.src(['*.js', '*/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('serve', function(cb) {
  todomvcServer.listen(8080, cb);
});

gulp.task('test', ['validate-api']);