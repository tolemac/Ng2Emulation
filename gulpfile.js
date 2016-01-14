var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('gulp-sequence');
var del = require('del');
var dtsBundle = require('dts-bundle');

var Builder = require('systemjs-builder');

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

gulp.task('clean-temp', function () {
    del([
        './dist/dts',
        './dist/js',
        './dist/src'
    ]);
});

gulp.task('definition-bundle', function () {
    var result = dtsBundle.bundle({
        name: 'Ng2Emulation',
        main: 'dist/dts/src/Ng2Emulation.d.ts',
        out: "~/dist/release/Ng2Emulation.d.ts",
        prefix: "",
        verbose: false,
        emitOnNoIncludedFileNotFound: true,
        emitOnIncludedFileNotFound: false
    });
    if (!result.emited){
        throw Error("dts-bundle from main file not emit result.");
    }
    // result = dtsBundle.bundle({
    //     name: 'Ng2Emulation',
    //     main: 'dist/dts/src/**/*.d.ts',
    //     out: "~/dist/release/Ng2Emulation2.d.ts",
    //     prefix: "",
    //     verbose: false,
    //     emitOnNoIncludedFileNotFound: true,
    //     emitOnIncludedFileNotFound: false
    // });
    // 
    // if (!result.emited){
    //     throw Error("dts-bundle from all files not emit result.");
    // }
});

gulp.task("bundle", function () {
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

gulp.task('default', function (done) {
    runSequence('clean', 'compile', 'bundle', 'definition-bundle', /*"clean-temp", */done);
});

gulp.task('typings', function (done) {
    runSequence('definition-bundle', done);
});

//gulp.task('default', ["build"]);