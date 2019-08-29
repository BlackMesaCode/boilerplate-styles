var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-clean-css');
var rename = require("gulp-rename");
var del = require('del');
var exec = require('child_process').exec; // part of nodejs - no npm package needed



var liveServer = require("live-server");
 
var liveServerParams = {
    port: 8181, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "dist", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [['/components', './node_modules']], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};



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
    liveServer.start(liveServerParams);
    // exec('live-server dist', function (err, stdout, stderr) {
    //     console.log(stdout);
    //     console.log(stderr);
    //     cb(err);
    // });
});


gulp.task("prepublish", gulp.series("clean", "sass", "minify"));

gulp.task("default", gulp.series("clean", "sass", "minify", gulp.parallel("watch", "liveserver")), function() {});
        