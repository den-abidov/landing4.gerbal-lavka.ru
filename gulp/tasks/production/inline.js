const gulp = require("gulp");

// inline - встраивание исходного кода в указанные <style>, <script> и <img> теги.
// npm install --save-dev gulp-inline-source
// Не работает с ES6+. Требует, чтобы JS был предварительно транспилирован в es2015 с помощью Babel.
const inlinesource = require('gulp-inline-source');
function runInlineSource()
{
    return gulp.src('./dist/*.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./dist'))
}
exports.inlinesource = runInlineSource;