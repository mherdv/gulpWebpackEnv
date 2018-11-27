const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const gulpImport = require("gulp-html-import");



gulp.task('js', () => {
    gulp.src('./src/js/index.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./dist/js'))

        .pipe(browserSync.reload({ stream: true }));
});



gulp.task("import", function () {
    gulp
        .src("./src/index.html")
        .pipe(gulpImport("./src/html/"))
        .pipe(gulp.dest("dist"));
});

gulp.task("scss", () => {
    return (
        gulp
            .src("src/scss/**/*.scss")
            .pipe(plumber())
            .pipe(sass())
            .pipe(
                autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
                    cascade: true
                })
            )
            // .pipe(cssnano())
            .pipe(gulp.dest("dist/css"))
            .pipe(browserSync.reload({ stream: true }))
    );
});

gulp.task("browser-sync", () => {
    browserSync({
        server: {
            baseDir: "dist"
        },
        notify: false
    });
});

gulp.task("default", ["browser-sync", "import", "js", "scss"], () => {
    gulp.watch("./src/js/**/*.js", ["js"]);
    gulp.watch("./src/scss/**/*.scss", ["scss"]);
    gulp.watch("./src/index.html", ["import"]);
    gulp.watch("./src/html/**/*.html", ["import"]);
    gulp.watch("./dist/*.html").on("change", browserSync.reload);
    // gulp.watch("./dist/*.js", [browserSync.reload]);
});
