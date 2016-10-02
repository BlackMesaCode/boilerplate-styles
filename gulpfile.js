var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-clean-css');
var rename = require("gulp-rename");
var del = require('del');

gulp.task("sass", function() {
    return gulp
        .src("./styles/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist"))
});

gulp.task("minify", function() {
    return gulp
        .src("./dist/*.css")
        .pipe(minifyCss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./dist"))
});

gulp.task("clean", function () {
    var filesToDelete = "dist/*";  // use * instead of *.*
    return del(filesToDelete).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'))});
});


gulp.task("prepublish", gulp.series("clean", "sass", "minify"))

        