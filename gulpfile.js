var gulp = require("gulp");
var uglify = require("gulp-uglify");
var minifyCSS = require("gulp-minify-css");
var autoPrefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var del = require("del");

// File Paths to Watch
var DIST_PATH = "dist";
var SCRIPTS_PATH = "src/**/*.js";
var CSS_PATH = "src/**/*.css";
var IMAGES_PATH = "src/images/**/*.{png,jpeg,jpg,svg,gif}";

//Image Compression
var imagemin = require("gulp-imagemin");
var imageminPngquant = require("imagemin-pngquant");
var imageminJpegRecompress = require("imagemin-jpeg-recompress");

// CSS Styles
gulp.task("styles", function() {
	return gulp
		.src(CSS_PATH)
		.pipe(sourcemaps.init())
		.pipe(autoPrefixer())
		.pipe(minifyCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH));
});

// Scripts
gulp.task("scripts", function() {
	return gulp
		.src(SCRIPTS_PATH)
		.pipe(
			babel({
				presets: ["es2015"]
			})
		)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH));
});

// Images
gulp.task("images", function() {
	return gulp
		.src(IMAGES_PATH)
		.pipe(
			imagemin([
				imagemin.gifsicle(),
				imagemin.jpegtran(),
				imagemin.optipng(),
				imagemin.svgo(),
				imageminPngquant(),
				imageminJpegRecompress()
			])
		)
		.pipe(gulp.dest(`${DIST_PATH}/images`));
});

gulp.task("clean", function() {
	return del.sync([DIST_PATH]);
});

// Default Task
gulp.task("default", ["clean", "images", "styles", "scripts"], function() {
	console.log("Starting Default Task");
});

// Watch Files For Changes
gulp.task("watch", ["default"], function() {
	console.log("Starting Watch Task");
	gulp.watch(SCRIPTS_PATH, ["scripts"]);
	gulp.watch(CSS_PATH, ["styles"]);
});
