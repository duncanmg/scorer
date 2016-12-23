var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function()
{
   return gulp.src('js/*.js')

      .pipe(jshint())

      .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
   var headerValue = "\n// Evaluated by gulp\n\n";
   return gulp.src(['js/*.js','js/controllers/*.js', 'js/services/*.js'])
      .pipe(concat('combined.js'))
      .pipe(header(headerValue))
      .pipe(gulp.dest('public/javascripts'))
      .pipe(rename('combined.min.js'))
      .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
      .pipe(header(headerValue))
      .pipe(gulp.dest('public/javascripts'));
});

gulp.task('watch', function() {
   gulp.watch('js/*.js', ['lint', 'scripts']);
});

gulp.task('default', ['lint', 'scripts', 'watch']);
