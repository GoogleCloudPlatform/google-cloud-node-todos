var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var Dredd = require('dredd');
var app = require('./todos.js');

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint());
});

gulp.task('develop', function () {
  nodemon({ script: 'server.js', ext: 'js'})
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('dredd', function(cb) {
  var server = app.listen(8080, function() {
    var dredd = new Dredd({
      blueprintPath: 'todos.apib',
      server: 'http://localhost:8080',
      options: {
        hookfiles: 'test_hooks.js'
      }
    });
    dredd.run(function(error, stats){
      server.close();
      cb();
    });
  });
});
