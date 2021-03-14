const gulp = require("gulp");

//npm install --save-dev gulp-clean
const clean = require('gulp-clean');

//delete css files from [dist]
function cleanCSS()
{
  return gulp.src('dist/assets/css/*.css', {read: false}).pipe(clean());
}
exports.cleanCSS = cleanCSS;

//delete js files from [dist]
function cleanJS()
{
  return gulp.src('dist/assets/js/*.js', {read: false}).pipe(clean());
}
exports.cleanJS = cleanJS;

//delete php in [dist]
function cleanPHP()
{
  return gulp.src('dist/assets/php/*.php', {read: false}).pipe(clean());
}
exports.cleanPHP = cleanPHP;

//delete images in [dist]
function cleanImages()
{
  return gulp.src('dist/assets/img/*.*', {read: false}).pipe(clean());
}
exports.cleanImages = cleanImages;

//delete html from [dist]
function cleanHTML()
{
  return gulp.src('dist/*.html', {read: false}).pipe(clean());
}
exports.cleanHTML = cleanHTML;