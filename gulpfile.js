const gulp = require('gulp');
const _$ = require('gulp-load-plugins')();
const path = require('path');
const del = require('del');

const cssSrc = ['src/stylus/*.styl'];
const jsSrc = ['src/js/*.js'];
const genericsrc = ['src/*.html', 'src/manifest.json'];

gulp.task('clean', function(cb) {
  return del(['tmp/**/*']);
    cb(err);
});

gulp.task('build', ['clean', 'files']);

gulp.task('dist', ['build'], function() {
  return gulp.src('tmp/*')
    .pipe(_$.zip('chrome.zip'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('files', ['stylus', 'js', 'icon'], function(cb) {
  return gulp.src(genericsrc)
    .pipe(gulp.dest('tmp/'));
  cb(err);
});

gulp.task('stylus', function(cb) {
  return gulp.src(cssSrc)
    .pipe(_$.stylus())
    .pipe(_$.csso())
    .pipe(gulp.dest('src/css'))
    .pipe(_$.rename({dirname: 'css', suffix: '.min'}))
    .pipe(gulp.dest('tmp/'));
    cb(err);
});

gulp.task('js', function(cb) {
  return gulp.src(jsSrc)
    .pipe(_$.jsmin())
    .pipe(_$.rename({dirname: 'js', suffix: '.min'}))
    .pipe(gulp.dest('tmp/'));
    cb(err);
});

gulp.task('icon', function(cb) {
  return gulp.src('icons/*.png')
    .pipe(gulp.dest('tmp/icons/'));
    cb(err);
});

gulp.task('watch', function() {
  gulp.watch(cssSrc, ['build']);
  gulp.watch(genericsrc, ['build']);
  gulp.watch(jsSrc, ['build']);
});
