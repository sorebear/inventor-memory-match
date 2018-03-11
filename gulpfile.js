const gulp = require('gulp');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const autoPrefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');

// File Paths to Watch
const DIST_PATH = 'dist';
const SCRIPTS_PATH = 'src/**/*.js';
const CSS_PATH = 'src/**/*.css';
const IMAGES_PATH = 'src/images/**/*.{png,jpeg,jpg,svg,gif}';

// Image Compression
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

// CSS Styles
gulp.task('styles', () => (
  gulp
    .src(CSS_PATH)
    .pipe(sourcemaps.init())
    .pipe(autoPrefixer())
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
));

// Scripts
gulp.task('scripts', () => (
  gulp
    .src(SCRIPTS_PATH)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
));

// Images
gulp.task('images', () => (
  gulp
    .src(IMAGES_PATH)
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
      imageminPngquant(),
      imageminJpegRecompress(),
    ])).pipe(gulp.dest(`${DIST_PATH}/images`))
));

gulp.task('clean', () => (
  del.sync([DIST_PATH])
));

// Default Task
gulp.task('default', ['clean', 'images', 'styles', 'scripts']);

// Watch Files For Changes
gulp.task('watch', ['default'], () => {
  gulp.watch(SCRIPTS_PATH, ['scripts']);
  gulp.watch(CSS_PATH, ['styles']);
});
