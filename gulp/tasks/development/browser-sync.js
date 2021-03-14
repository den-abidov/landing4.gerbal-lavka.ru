const gulp = require("gulp");

// BrowserSync - для автоматического обновления страницы
// См. https://browsersync.io/docs/gulp
// См. https://github.com/gulpjs/gulp/blob/master/docs/recipes/minimal-browsersync-setup-with-gulp4.md

const bs = require('browser-sync').create();

function reload(done) {
    bs.reload();
    done();
}
exports.reload = reload;

function serve(done) {
    bs.init({
        server: {
            baseDir: './dist/'
        }
    });
    done();
}
exports.serve = serve;