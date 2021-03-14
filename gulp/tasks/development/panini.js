const gulp = require("gulp");

// run panini
// соот-ие папки : data, helpers, layouts, pages, partials, styleguide
// npm install --save-dev panini
const panini = require('panini');
function runPanini()
{
    return gulp.src('src/pages/*.html')
        .pipe(panini({
            root: 'src/pages/',
            layouts: 'src/layouts/',
            partials: 'src/partials/',
            helpers: 'src/helpers/',
            data: 'src/data/'
        }))
        .pipe(gulp.dest('dist'));
}
exports.panini = runPanini;