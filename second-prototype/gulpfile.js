"use strict";

const gulp = require('gulp');

const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const header = require('gulp-header');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const jsdoc = require('gulp-jsdoc3');
const jasmine = require('gulp-jasmine');
const watch = require('gulp-watch');
const batch = require('gulp-batch');

const Server = require('karma').Server;

function lint() {
  return gulp.src(['js/*.js', 'js/controllers/*.js', 'js/services/*.js', 'js/factories/**/*.js', 'js/lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

function test(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    // configFile: __dirname + '/node_modules/karma/karma.conf.js',
    singleRun: true
  }, done).start();
}

function scripts() {
  const headerValue = "\n// Evaluated by gulp\n\n";
  return gulp.src(['js/*.js', 'js/controllers/*.js', 'js/services/*.js', 'js/factories/**/*.js', 'js/lib/**/*.js'])
    .pipe(concat('combined.js'))
    .pipe(header(headerValue))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename('combined.min.js'))
    .pipe(uglify().on('error', function(e) {
      console.log(e);
    }))
    .pipe(header(headerValue))
    .pipe(gulp.dest('public/javascripts'));

}

function build_jsdoc(cb) {
  var config = require('./jsdoc.json');
  gulp.src(['README.md'], {
      read: false
    })
    .pipe(jsdoc(config, cb));
}

function watchFiles(done) {
  gulp.watch(['js/*.js',
      'js/controllers/*.js',
      'js/services/*.js',
      'tests/unit/**/*.js',
      'js/factories/**/*.js',
      'js/lib/**/*.js'
    ],
    gulp.series(lint, scripts, test, build_jsdoc));
    done();
}

const build = gulp.series(lint, scripts, test, build_jsdoc, watchFiles);

exports.lint = lint;
exports.test = test;
exports.scripts = scripts;
exports.jsdoc = jsdoc;
exports.watchFiles = watchFiles;
exports.default = build;

//gulp.task('watched', gulp.series(['lint', 'scripts', 'jsdoc', 'test']));
//
////gulp.task('watch', gulp.series(function() {
////   gulp.watch(['js/*.js',
////	'js/controllers/*.js',
////	'js/services/*.js',
////	'tests/unit/**/*.js',
////	'js/factories/**/*.js',
////	'js/lib/**/*.js'], ['lint', 'scripts', 'jsdoc', 'test']);
////}));
//
//// Watch files
//function watchFiles() {
//  gulp.watch("js/**/*.js", watched);
////  gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
////  gulp.watch(
////    [
////      "./_includes/**/*",
////      "./_layouts/**/*",
////      "./_pages/**/*",
////      "./_posts/**/*",
////      "./_projects/**/*"
////    ],
////    gulp.series(jekyll, browserSyncReload)
////  );
////  gulp.watch("./assets/img/**/*", images);
//}
//
//gulp.task('default', gulp.series(['lint', 'scripts', 'jsdoc', 'test', 'watch']));
////gulp.task('default', gulp.series(['lint', 'scripts', 'jsdoc', 'test']));
