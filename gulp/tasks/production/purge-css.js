const gulp = require("gulp");

// Избавься от неиспользуемых CSS селекторов
// Установи purgecss: https://github.com/FullHuman/purgecss
// для gulp: npm install --save-dev gulp-purgecss

const purgecss = require('gulp-purgecss');
function purgeCSS()
{
    return gulp.src('dist/assets/css/*.css')
        .pipe(purgecss({ content: ['dist/*.html', 'dist/assets/js/*.js'] }))
        .pipe(gulp.dest('dist/assets/css'))
}
exports.purgeCSS = purgeCSS;