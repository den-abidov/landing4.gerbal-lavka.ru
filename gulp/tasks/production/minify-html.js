const gulp = require("gulp");

// minify html
// npm install --save-dev gulp-htmlmin
const htmlmin = require('gulp-htmlmin');
function minifyHTML()
{
    return gulp.src('dist/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
}
exports.minifyHTML = minifyHTML;
