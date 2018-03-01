/*global require: false*/
/*global console: false*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var distFile = 'csv-export';

gulp.task('clean', function () {
    'use strict';
    console.info('\t\t- Limpando arquivos de distribuição.');
    return gulp.src('dist/*', {force: true})
        .pipe(clean());
});

gulp.task('copyHtmlFiles', function () {
    'use strict';
    console.info('\t\t- Copiando os arquivos de template.');
    
    return gulp.src('./src/directives/templates/*.html')
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/templates'));
});

gulp.task('minifyJsFiles', function () {
    'use strict';
    console.info('\t\t- Copiando os arquivos JS.');
    return gulp.src(['./src/services/*.js', './src/controllers/*.js', './src/directives/*.js', './src/*.js'])
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(concat(distFile + '.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('dist', ['clean', 'copyHtmlFiles', 'minifyJsFiles']);