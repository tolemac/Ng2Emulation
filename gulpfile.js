var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('gulp-sequence');
var del = require('del');
var dtsBundle = require('dts-bundle');
var Builder = require('systemjs-builder');
var Q = require('q');
var watch = require('gulp-watch');
var tsd = require('gulp-tsd');

var tsProject = ts.createProject('tsconfig.json', { typescript: require('typescript') });

gulp.task('compile', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
});

gulp.task('clean', function () {
    del([
        './dist'
    ]);
});

gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task('bundle-dts', function () {
    var result = dtsBundle.bundle({
        name: 'ng2-emulation',
        main: 'dist/src/ng2-emulation.d.ts',
        out: "~/dist/release/ng2-emulation.d.ts",
        prefix: "",
        verbose: false,
        emitOnNoIncludedFileNotFound: true,
        emitOnIncludedFileNotFound: false
    });
    if (!result.emitted) {
        throw Error("dts-bundle from main file not emit result.");
    }
});

function bundleJs() {
    var builder = new Builder('dist/src');
    builder.config({
        meta: {
            'HTML5Tokenizer.js': {
                build: false
            }
        },
        defaultJSExtensions: true
    });

    return builder
        .bundle('ng2-emulation.js', 'dist/release/ng2-emulation-bundle.js');
}

gulp.task("bundle", function () {

    var deferred = Q.defer();

    bundleJs()
        .then(function () {
            deferred.resolve();
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
            deferred.reject(err);
        });

    return deferred.promise;
});

gulp.task('default', function (done) {
    runSequence('clean', 'tsd', 'compile', 'bundle', 'bundle-dts', /*"clean-temp", */done);
});

var debug_src = 'demos/ng2emulation-vs-aspnet-debug/ng2emulation-vs-aspnet-debug/TypeScript/Ng2Emulation';
var project_src = 'src';
var debug_dts = 'demos/ng2emulation-vs-aspnet-debug/ng2emulation-vs-aspnet-debug/TypeScript/typings';
var project_dts = 'typings';

gulp.task("copy-src-to-debug-env", function () {
    return gulp.src(project_src + '/**/*', { base: project_src })
        .pipe(gulp.dest(debug_src));
});

gulp.task("copy-typings-to-debug-env", function () {
    return gulp.src(project_dts + '/**/*', { base: project_dts })
        .pipe(gulp.dest(debug_dts));
});

gulp.task("watch-debug", function () {
    gulp.src(debug_src + '/**/*.ts', { base: debug_src })
        .pipe(watch(debug_src, { base: debug_src }))
        .pipe(gulp.dest(project_src));
});

gulp.task('start-debug-env', function (done) {
    runSequence(['copy-src-to-debug-env', "copy-typings-to-debug-env"], "watch-debug", done);
});

//gulp.task('default', ["build"]);