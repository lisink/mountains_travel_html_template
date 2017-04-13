'use strict';

//Gulp
var gulp = require('gulp');

//Compilers for sass and pug
var sass = require('gulp-sass'),
    pug = require('gulp-pug');

//Plugins for work with streams
var addSrc = require('gulp-add-src'),
    merge = require('merge-stream');

//Css building plugins
var csscomb = require('gulp-csscomb'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat');

//Js building plugins
var minify = require('gulp-minify');

var imagemin = require('gulp-imagemin');

//Watch and livereload
var gls = require('gulp-live-server'),
    watch = require('gulp-watch');

// Custom functions & variables
var outputPath = 'dev';

function swallowError (error) {
    console.log(error.toString());
    this.emit('end')
}

// Tasks
gulp.task('default', function () {
    console.log('test echo');
});

gulp.task('csscomb', function () {
  return gulp.src(['./src/scss/**/*.scss', '!src/scss/_*.scss'])
    .pipe(csscomb())
    .pipe(gulp.dest('./src/scss/'));
});

gulp.task('build_css', function () {
    var css = gulp.src(['./src/css/**/*.css', '!./src/css/reset.css', '!./src/css/old/*.css'])
        .pipe(addSrc.prepend('./src/css/reset.css'))
        .pipe(addSrc.prepend('./src/css/google_fonts.css'))
        .pipe(sourcemaps.init());

    var scss = gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', swallowError);

    var mergedStream = merge(css, scss).on('error', swallowError)
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputPath+'/css'));

    return mergedStream;
});

gulp.task('clean_css', function () {
    return  gulp.src(outputPath + '/css/styles.css')
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(cleanCSS({
                specialComments: false,
            }))
            .pipe(gulp.dest(outputPath+'/css'));
});

gulp.task('build_html', function buildHTML() {
    return gulp.src('./src/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .on('error', swallowError)
        .pipe(gulp.dest(outputPath));
});

gulp.task('build_html_prod', function buildHTML() {
    return gulp.src('./src/*.pug')
        .pipe(pug())
        .pipe(gulp.dest(outputPath));
});


gulp.task('serve', function() {
    var server = gls.static(outputPath);
    server.start();

    watch([outputPath+'/**/*.css', outputPath+'/*.html', outputPath+'/**/*.js'], function (file) {
        server.notify.apply(server, [file]);
    });
});

gulp.task('watch', function () {
    watch('src/**/*.pug', function () {
        gulp.start('build_html');
    });
    watch('src/scss/**/*.scss', function () {
        gulp.start('build_css');
    });
    watch('src/js/*.js', function () {
        gulp.start('build_js');
    });
});

gulp.task('imagemin', () =>
    gulp.src(outputPath+'/i/*')
        .pipe(imagemin())
        .pipe(gulp.dest(outputPath+'/i/min'))
);

gulp.task('build_js', function() {
  gulp.src('./src/js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest(outputPath+'/js'))
});

gulp.task('build', ['build_html', 'build_css', 'build_js']);
gulp.task('build_prod', ['build_html_prod', 'clean_css']);
gulp.task('server', ['serve', 'watch']);
