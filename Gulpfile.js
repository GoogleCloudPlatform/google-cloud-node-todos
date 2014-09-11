var gulp = require('gulp');
var Dredd = require('dredd');
var app = require('./todos.js');

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

gulp.task('test', ['lint', 'dredd']);
