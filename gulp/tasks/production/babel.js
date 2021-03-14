const gulp = require("gulp");

// Babel
// Транспиляция ES6+ -> es2015
// Babel 6 : gulp babel-core babel-preset-env
// Babel 7 : npm install --save-dev gulp-babel@next @babel/core babel-preset-env
// В директории с этим gulpfile.js создай файл настроек .babelrc
// Подробности здесь : https://babeljs.io/en/setup#installation
const babel = require("gulp-babel");
function runBabel()
{
    return gulp.src("dist/assets/js/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist/assets/js/"))
    /*return gulp.src("dist/assets/js/*.js")
    .pipe(babel({ presets: ['@babel/preset-env']}))
    .pipe(gulp.dest("dist/assets/js/"));*/
}
exports.babel = runBabel;