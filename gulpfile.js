var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var exec = require('gulp-exec');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var uglify = require('gulp-uglify');
var requirejs = require('requirejs');

var paths = {
    less: 'less/*.less'
};

//将文件中的js，css替换成加上版本号的新文件
function replaceJs(filename) {
    if (filename.indexOf('main') > -1) {
        return filename.replace('.js', '');
    }
    return filename;
}
function replaceJsforMain(filename) {
    if (filename.indexOf('main') > -1){
        return filename.replace('.js', '').replace('js/main','main');
    }
    return filename;
}

//清空dist文件夹
gulp.task('clean', function() {
    return del.sync(['dist/*']);
});

//单独压缩requirejs
gulp.task('script', function() {
   gulp.src(['js/lib/requirejs/require.js'], {base: 'js'})
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    gulp.src(['js/md5.js'], {base: 'js'})
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

});

gulp.task('index', function() {
    return gulp.src('index.html').pipe(gulp.dest('dist'));
});

gulp.task('modules', function() {
    return gulp.src('./modules/**')
        .pipe(gulp.dest('dist/modules'));
});
gulp.task('diretive', function() {
    return gulp.src('./diretive/**')
        .pipe(gulp.dest('dist/diretive'));
});
gulp.task('res', function() {
     gulp.src('./fonts/**')
        .pipe(gulp.dest('dist/fonts'));
    gulp.src('./css/ionic.min.css')
        .pipe(gulp.dest('dist/css'));
    gulp.src('./res/**')
        .pipe(gulp.dest('dist/res'));
});
//根据依赖合并压缩libs
gulp.task('require', function(taskReady) {
    var requirejsConfig = {
      baseUrl: './js',
      name: 'main',
      paths: {},
      optimize: 'uglify',//'uglify';
      mainConfigFile: './js/require_config.js',
      out: './dist/build/js/main.js',
      //Inlines the text for any text! dependencies, to avoid the separate
      //async XMLHttpRequest calls to load those dependencies.
      inlineText: true,
      //Allow "use strict"; be included in the RequireJS files.
      useStrict: true,
      //Finds require() dependencies inside a require() or define call.
      findNestedDependencies: true
    };
    requirejs.optimize(requirejsConfig, function () {
      taskReady();
    }, function (err) {
      console.log(err);
      taskReady();
    });
});

//给js文件添加版本号
gulp.task('rev-require', ['require', 'script'], function() {
   return  gulp.src('dist/build/js/*.js', {base: 'dist/build'})
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('dist/build'));
});

gulp.task("rev-replace-index", ['index','rev-require'], function(){
    return gulp.src('dist/index.html').pipe(gulp.dest('dist'));
});

gulp.task('dev-less', function() {
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
    gulp.watch(paths.less, ['dev-less']);
});

gulp.task('build', ['rev-replace-index','dev-less','modules','res','diretive'], function() {
    return del.sync(['dist/build/**']);
});
gulp.task('prod', ['clean'], function() {
    gulp.start('build');
});