const gulp = require("gulp");

// autoprefixer for CSS
// npm install --save-dev gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer');
function CSSautoprefixer()
{
    return gulp.src('dist/assets/css/*.css')
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gulp.dest('dist/assets/css'))
}
exports.autoprefixer = CSSautoprefixer;