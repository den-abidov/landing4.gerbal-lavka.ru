const gulp = require("gulp");

// CSS optimizer : минификация CSS
// npm install --save-dev gulp-csso
// url gulp-csso : https://www.npmjs.com/package/gulp-csso
// url csso : https://www.npmjs.com/package/csso
const csso = require('gulp-csso');
function runCSSO()
{
    return gulp.src('./dist/assets/css/*.css')
        .pipe(csso({ restructure: true, sourceMap: false,  debug: false }))
        .pipe(gulp.dest('./dist/assets/css'));
}
exports.csso = runCSSO;