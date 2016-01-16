var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('gulp-sequence');
var del = require('del');
var dtsBundle = require('dts-bundle');
var Builder = require('systemjs-builder');
var Q = require('q');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/dts')),
        tsResult.js.pipe(gulp.dest('dist/js')),
    ]);
});

gulp.task('clean', function () {
    del([
        './dist'
    ]);
});

gulp.task('bundle-dts', function () {
    var result = dtsBundle.bundle({
        name: 'Ng2Emulation',
        main: 'dist/dts/src/Ng2Emulation.d.ts',
        out: "~/dist/release/Ng2Emulation.d.ts",
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
    var builder = new Builder('dist/js/src');
    builder.config({
        meta: {
            'HTML5Tokenizer.js': {
                build: false
            }
        },
        defaultJSExtensions: true
    });

    return builder
        .bundle('Ng2Emulation.js', 'dist/release/Ng2Emulation-bundle.js');
}

gulp.task("bundle", function () {

    var deferred = Q.defer();

    bundleJs()
        .then(function () {
            deferred.resolve();
        })
        .catch(function (err) {
            console.log('Build error');
            deferred.reject(err);
        });

    return deferred.promise;
});

gulp.task('default', function (done) {
    runSequence('clean', 'compile', 'bundle', 'bundle-dts', /*"clean-temp", */done);
});

gulp.task("copy-src-to-debug-env", function () {
    gulp.src('src/**/**')        
        .pipe(gulp.dest('demos/ng2emulation-vs-aspnet-debug/ng2emulation-vs-aspnet-debug/TypeScript/Ng2Emulation'));
});

gulp.task('start-debug-env', function (done) {
    runSequence('copy-src-to-debug-env', done);
});

//gulp.task('default', ["build"]);