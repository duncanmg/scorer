var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jsdoc = require('gulp-jsdoc3');
var jasmine = require('gulp-jasmine');

var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('lint', function()
{
   return gulp.src(['js/*.js','js/controllers/*.js', 'js/services/*.js', 'js/factories/**/*.js'])

      .pipe(jshint())

      .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
   var headerValue = "\n// Evaluated by gulp\n\n";
   return gulp.src(['js/*.js','js/controllers/*.js', 'js/services/*.js', 'js/factories/**/*.js'])
      .pipe(concat('combined.js'))
      .pipe(header(headerValue))
      .pipe(gulp.dest('public/javascripts'))
      .pipe(rename('combined.min.js'))
      //.pipe(uglify().on('error', function(e){
      //      console.log(e);
      //   }))
      .pipe(header(headerValue))
      .pipe(gulp.dest('public/javascripts'));
});

// Search paths are in jsdoc.json
gulp.task('jsdoc', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md'], {read: false})
        .pipe(jsdoc(config, cb));
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    // configFile: __dirname + '/node_modules/karma/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', function() {
   gulp.watch(['js/*.js','js/controllers/*.js', 'js/services/*.js', 'tests/unit/**/*.js', 'js/factories/**/*.js'], ['lint', 'scripts', 'jsdoc', 'test']);
});

gulp.task('default', ['lint', 'scripts', 'jsdoc', 'test', 'watch']);
