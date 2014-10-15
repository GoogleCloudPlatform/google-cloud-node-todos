'use strict';

var gulp = require('gulp');
var Dredd = require('dredd');
var jshint = require('gulp-jshint');
var server = require('./server');

gulp.task('dredd', function(cb) {
  var test = new Dredd({
    blueprintPath: 'todos.apib',
    server: 'http://localhost:8080',
    options: {
      hookfiles: 'tests/hooks.js'
    }
  });

  server.listen(8080, function() {
    test.run(function() {
      this.close(cb);
    }.bind(this));
  });
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!**/node_modules/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('serve', function(cb) {
  server.listen(8080, cb);
});

gulp.task('test', ['dredd']);