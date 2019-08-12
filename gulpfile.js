const { src, dest, parallel } = require('gulp');

const gulp = require('gulp');
const pug = require('gulp-pug');
const { watch } = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync");
const imagemin = require('gulp-imagemin');
const plumber = require("gulp-plumber");

function html() {
    return src('./src/pug/index.pug')
        .pipe(pug())
        .pipe(dest('dist/'))
}

function js() {
    return gulp.src('./src/js/index.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./dist/js'))

};

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}



function images() {
    return gulp
      .src("./src/img/**/*")
      .pipe(newer("./dist/img"))
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [
              {
                removeViewBox: false,
                collapseGroups: true
              }
            ]
          })
        ])
      )
      .pipe(gulp.dest("./dist/img"));
  }


function watchFiles() {
    watch("./src/scss/*", gulp.series(scss, browserSyncReload) );
    watch("./src/js/*",  gulp.series(js, browserSyncReload));
    watch("./src/pug/*",gulp.series(html, browserSyncReload) );
}



function scss() {
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
    );
};


exports.default = parallel(html, scss, js,browserSync,watchFiles);
exports.watch = gulp.parallel(watchFiles);
// exports.images = images;

