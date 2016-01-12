var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var del = require('del');
var dtsBundle = require('dts-bundle');

var browserify = require('browserify');
var tsify = require('tsify');

var Builder = require('systemjs-builder');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/dts')),
        tsResult.js.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('bundle', function () {
    var es5 = gulp.src('dist/js/src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('Ng2Emulation-es5.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/release'));

    return es5;
    // var dts = gulp.src('dist/dts/src/**/*.d.ts')
    // .pipe(gulp.dest('dist/release'));
    // 
    // return merge([es5, dts]);
});

gulp.task('clean', function () {
    del([
        './dist'//,
        // './dist/ng-forward.es6.js',
        // './dist/ng-forward.es5.js'
    ]);
});

gulp.task('clean-temp', function () {
    del([
        './dist/dts',
        './dist/js'
        // './dist/ng-forward.es6.js',
        // './dist/ng-forward.es5.js'
    ]);
});

gulp.task('definition-bundle', function () {
    //console.log(dtsGenerator);
    dtsBundle.bundle({
        name: 'Ng2Emulation',
        main: 'dist/dts/src/Ng2Emulation.d.ts',
        out: "dist/release/Ng2Emulation.d.ts",
        exclude: /.*typings.*/,
        verbose: true
    });
});

gulp.task("tsfy", function () {
    return browserify()
        .add('src/ng2emulation.ts')
        .plugin(tsify, { noImplicitAny: false })
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(process.stdout);
});

gulp.task("system-builder", function () {
    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('dist/js/src');

    builder.config({
        meta: {
            'HTML5Tokenizer.js': {
                build: false
            }
        },
        defaultJSExtensions: true
    });

    builder
        .bundle('Ng2Emulation.js', 'dist/release/Ng2Emulation-bundle.js')
        .then(function () {
            console.log('Build complete');
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
        });
});

gulp.task('build', function (done) {
    runSequence('clean', 'compile', 'system-builder', 'definition-bundle', "clean-temp", done);
});