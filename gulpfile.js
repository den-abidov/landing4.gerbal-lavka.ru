/**
 * версия       : 4
 * дата создания: 2021.01.25
 * изменения    : разбил один большой gulpfile.js на много отдельных файлов.
 */
'use strict';
/************************ 1. Development Build ************************************/
const { series, parallel } = require('gulp');

const gulp = require("gulp");

const sass = require('./gulp/tasks/development/sass.js').sass;
exports.sass = sass;

const panini = require('./gulp/tasks/development/panini.js').panini;
exports.panini = panini;

const cleanCSS = require('./gulp/tasks/development/clean.js').cleanCSS;
exports.cleanCSS = cleanCSS;

const cleanJS = require('./gulp/tasks/development/clean.js').cleanJS;
exports.cleanJS = cleanJS;

const cleanPHP = require('./gulp/tasks/development/clean.js').cleanPHP;
exports.cleanPHP = cleanPHP;

const cleanImages = require('./gulp/tasks/development/clean.js').cleanImages;
exports.cleanImages = cleanImages;

const cleanHTML = require('./gulp/tasks/development/clean.js').cleanHTML;
exports.cleanHTML = cleanHTML;

const copyJS = require('./gulp/tasks/development/copy.js').copyJS;
exports.copyJS = copyJS;

const copyPHP = require('./gulp/tasks/development/copy.js').copyPHP;
exports.copyPHP = copyPHP;

const copyImages = require('./gulp/tasks/development/copy.js').copyImages;
exports.copyImages = copyImages;

const copyHTML = require('./gulp/tasks/development/copy.js').copyHTML;
exports.copyHTML = copyHTML;

/************************ 2. Production Build ************************************/

const stripHTMLcomments = require('./gulp/tasks/production/strip-comments.js').stripHTMLcomments;
exports.stripHTMLcomments = stripHTMLcomments;

const stripJScomments = require('./gulp/tasks/production/strip-comments.js').stripJScomments;
exports.stripJScomments = stripJScomments;

const stripJSdebug = require('./gulp/tasks/production/strip-comments.js').stripJSdebug;
exports.stripJSdebug = stripJSdebug;

const purgeCSS = require('./gulp/tasks/production/purge-css.js').purgeCSS;
exports.purgeCSS = purgeCSS;

const autoprefixer = require('./gulp/tasks/production/auto-prefix-css.js').autoprefixer;
exports.autoprefixer = autoprefixer;

const csso = require('./gulp/tasks/production/csso.js').csso;
exports.csso = csso;

const babel = require('./gulp/tasks/production/babel.js').babel;
exports.babel = babel;

const inlinesource = require('./gulp/tasks/production/inline.js').inlinesource;
exports.inlinesource = inlinesource;

const minifyHTML = require('./gulp/tasks/production/minify-html.js').minifyHTML;
exports.minifyHTML = minifyHTML;

const copySiteVerificationHTML = require('./gulp/tasks/development/copy.js').copySiteVerificationHTML;

/************************ 3. Group Tasks ************************************/

const deleteFiles = parallel(cleanCSS, cleanJS, cleanPHP, cleanImages, cleanHTML);
exports.deleteFiles = deleteFiles;

const copyFiles = parallel(copyJS, copyPHP, copyImages, copyHTML);
exports.copyFiles = copyFiles;

const makeFiles = parallel(sass, panini);
exports.makeFiles = makeFiles;

const compile = series(deleteFiles, copyFiles, makeFiles);
exports.compile = compile;

const stripMessages = parallel(stripHTMLcomments, stripJScomments);//, stripJSdebug); убрал, т.к. заменяет console.log на void 0; => вызывает ошибку в inline или минификации
exports.stripMessages = stripMessages;

const optimizeCSS = series(purgeCSS, autoprefixer, csso);
exports.optimizeCSS = optimizeCSS;

const optimizeJS = series(babel);// исключил uglifyJS, т.к. он даёт ошибки
exports.optimizeJS = optimizeJS;

// uglifyJS уже и неактуален, т.к. весь код отлично сжимается (инлайнится) при помощи minifyHTML
const build = series(compile, stripMessages, optimizeCSS, optimizeJS, inlinesource, minifyHTML, copySiteVerificationHTML);
exports.build = build;

exports.default = compile;

// browser reload
const reload= require('./gulp/tasks/development/browser-sync.js').reload;
const serve= require('./gulp/tasks/development/browser-sync.js').serve;
const watchChanges = () => gulp.watch('src', gulp.series(gulp.parallel(cleanCSS, cleanJS, cleanPHP,sass, panini, copyJS), reload));
exports.watch = gulp.parallel(watchChanges, serve); // было gulp.series(serve, watchChanges)
