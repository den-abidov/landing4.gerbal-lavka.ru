const gulp = require("gulp");

/**
 * 2019.02.03 Удалим комментарии из HTML, JS, CSS *
 * По документации можно удалить и комментарии из CSS файлов, но у меня это вызвало ошибку.
 * Но по правде удаление комментариев из CSS файлов вообще не критично :
 * главное - убрать комментарии из JS и HTML.
 */

//npm install --save-dev gulp-strip-comments
const strip = require('gulp-strip-comments');

function stripHTMLcomments()
{
    return gulp.src('dist/*.html')
        .pipe(strip())
        .pipe(gulp.dest('dist'));
}
exports.stripHTMLcomments = stripHTMLcomments;

function stripJScomments()
{
    return gulp.src('dist/assets/js/*.js')
        .pipe(strip())
        .pipe(gulp.dest('dist/assets/js'));
}
exports.stripJScomments = stripJScomments;

// Из JS ещё нужно удалить выражения console.log(), alert() и debug()
// npm install --save-dev gulp-strip-debug
const stripDebug = require('gulp-strip-debug');
function stripJSdebug()
{
    return gulp.src('dist/assets/js/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('dist/assets/js'))
}
exports.stripJSdebug = stripJSdebug;
