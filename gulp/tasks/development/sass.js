const gulp = require("gulp");

// sass : для преобразования scss => css
// npm install --save-dev gulp-sass
const sass = require('gulp-sass');

function runSass() 
{
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/assets/css'));
    // Видел на одном сайте, что для BrowserSync, для слежения за sass (а также и Panini)
    // и обновления браузера, нужно добавлять одну из следующих строк в конце :
    // .pipe(bs.stream());
    //.pipe(bs.stream());
    // но у меня работает из без них.
}
exports.sass = runSass;
