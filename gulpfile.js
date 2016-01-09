var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var del = require('del');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function() {
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('bundle', function() {
  return gulp.src('dist/js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('Ng2Emulation-es5.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
   del([
		'./dist'//,
		// './dist/ng-forward.es6.js',
		// './dist/ng-forward.es5.js'
	]); 
});

gulp.task('build', function(done) {
  runSequence('clean', 'compile', 'bundle', done);
});