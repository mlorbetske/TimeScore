﻿/// <binding AfterBuild='default' ProjectOpened='watch' />

var gulp = require("gulp"),
    manifest = require("gulp-cache-manifest"),
    concat = require("gulp-concat");

gulp.task("default", ["concat", "manifest"]);


gulp.task("concat", function () {
    gulp.src(["./assets/js/badges.js", "./assets/js/highscore.js", "./assets/js/timescore.js", "./assets/js/dom.js"])
        .pipe(concat("all.js"))
        .pipe(gulp.dest("./assets/dist"))
});

gulp.task("manifest", function () {
    gulp.src(["./assets/{dist,css,img}/*", "./index.html", "web.config"])
    .pipe(manifest({
        timestamp: true,
        relativePath: "assets",
        preferOnline: true,
        network: ["http://*"],
        filename: "manifest.appcache",
        exclude: ["index.html", "web.config"]
    }))
    .pipe(gulp.dest('./'));
});

gulp.task("watch", ["concat", "manifest"], function () {
    gulp.watch("./assets/js/*", ["concat", "manifest"]);
    gulp.watch("./assets/css/*", ["manifest"]);
    gulp.watch(["./index.html", "./web.config"], ["manifest"]);
});