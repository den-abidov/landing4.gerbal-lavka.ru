const gulp = require("gulp");

//copy js files [src] -> [dist]
function copyJS()
{
  return gulp.src("src/assets/js/*.js")//,{since:gulp.lastRun("src/assets/img")})
      .pipe(gulp.dest('dist/assets/js'));
}
exports.copyJS = copyJS;

//copy images [src] -> [dist]. Important: folders not copied. Copy folders manually.
function copyImages()
{
  return gulp.src("src/assets/img/*.*")//,{since:gulp.lastRun("src/assets/img")})
      .pipe(gulp.dest('dist/assets/img'));
}
exports.copyImages = copyImages;

//copy php [src] -> [dist]
function copyPHP()
{
  return gulp.src("src/assets/php/*.php")//,{since:gulp.lastRun("src/assets/img")})
      .pipe(gulp.dest('dist/assets/php'));
}
exports.copyPHP = copyPHP;

//copy html [src] -> [dist]
function copyHTML()
{
  return gulp.src("src/*.html")//,{since:gulp.lastRun("src/assets/img")})
      .pipe(gulp.dest('dist'));
}
exports.copyHTML = copyHTML;

//copy html [site verification] -> [dist]
function copySiteVerificationHTML()
{
  return gulp.src("site_verification/*.html")//,{since:gulp.lastRun("src/assets/img")})
      .pipe(gulp.dest('dist'));
}
exports.copySiteVerificationHTML = copySiteVerificationHTML;