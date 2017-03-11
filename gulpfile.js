var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-clean-css');
var rename = require("gulp-rename");
var del = require('del');
var exec = require('child_process').exec; // part of nodejs - no npm package needed

gulp.task("sass", function() {
    return gulp
        .src("./styles/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest("./dist"))
});


gulp.task("watch", function() {
    return gulp.watch("./styles/*.scss", gulp.series("sass"));  // in gulp 4.x we have to pass a function like gulp.series or gulp.parallel
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
    var filesToDelete = "dist/*.css";  // use * instead of *.*
    return del(filesToDelete).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'))});
});


gulp.task('liveserver', function (cb) {
    exec('live-server dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task("prepublish", gulp.series("clean", "sass", "minify"));

gulp.task("default", gulp.series("clean", "sass", "minify", gulp.parallel("watch", "liveserver")), function() {});
        