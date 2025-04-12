// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use
//sass.compiler = require('dart-sass');  (not needed in this case)

// Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError)) // Handle Sass errors gracefully
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}
// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

function browserSyncServe(cb) {
    browsersync.init({
      server: {
        baseDir: '.',
      },
      notify: {
        styles: {
          top: 'auto',
          bottom: '0',
        },
      },
    });
    return cb(); // Explicitly return the callback
  }
  
  function browserSyncReload(cb) {
    browsersync.reload();
    return cb(); // Explicitly return the callback
  }

// Watch Task
function watchTask() {
    return watch(
      ['*.html', 'app/scss/**/*.scss', 'app/**/*.js'],
      series(scssTask, jsTask, browserSyncReload)
    );
  }
  

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask);

exports.scssTask = scssTask;