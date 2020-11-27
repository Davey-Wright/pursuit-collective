// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
// const { src, dest, watch, series, parallel } = require('gulp');
const gulp = require('gulp');

// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const babel = require('gulp-babel');

const cssVars = require('postcss-simple-vars');
const cssNested = require('postcss-nested');
const cssImport = require('postcss-import');


const plumber = require('gulp-plumber');
const through2 = require('through2');



// File paths
const paths = { 
  js: ['src/js/components/*.js', 'src/js/index.js'],
  vendorsJS: 'src/vendors/js/**/*.js',
  scss: 'src/scss/index.scss',
  vendorsCSS: 'src/vendors/css/**/*.css',
}




const touch = () => through2.obj( function( file, enc, cb ) {
  if ( file.stat ) {
    file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
  }
  cb( null, file );
});



// compile, minify, save to cdn/vendors.min.css
function cssVendorsTask(){
  return gulp.src(paths.vendorsCSS)
    .pipe(plumber())
    .pipe(concat('concat.css')) 
    .pipe( postcss([cssImport, cssVars, cssNested, autoprefixer(), cssnano]) )
    .pipe(rename('vendors.min.css'))
    .pipe( touch() )
    .pipe( gulp.dest('cdn') 
  );
}


function scssTask(){    
  return gulp.src(paths.scss)
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano ]))
    .pipe(rename('application.min.css'))
    // .pipe(sourcemaps.write('.'))
    .pipe( touch() )
    .pipe(gulp.dest('cdn')
  );
}


function jsVendorsTask() {
  return gulp.src(paths.vendorsJS)
    .pipe(concat('vendors.min.js'))
    .pipe(uglify())
    .pipe(touch())
    .pipe(gulp.dest('cdn'))
}

function jsTask(){
  return gulp.src(paths.js, {allowEmpty: true})
    .pipe(plumber())
    .pipe(concat('concat.js'))
    .pipe(babel({
      presets: [
        ['@babel/env', {
          modules: false
        }]
      ]
    }))
    .pipe(uglify())
    .pipe(rename('application.min.js'))
    .pipe(touch())
    .pipe(gulp.dest('cdn')
  );
}



// Cachebust
function cacheBustTask(){
  var cbString = new Date().getTime();
  return gulp.src(['index.html'], { allowEmpty: true })
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(gulp.dest('.'));
}

function watchTask(){
  gulp.watch(['src/scss/**/*.scss', 'src/js/**/*.js'],
    { interval: 1000, usePolling: true }, //Makes docker work
    gulp.series(
      gulp.parallel(scssTask, jsTask),
      cacheBustTask
    )
  );    
}

exports.js = jsTask;
exports.jsVendors = jsVendorsTask

exports.scss = scssTask;
exports.cssVendors = cssVendorsTask

exports.vendors = gulp.series(
  gulp.parallel(jsVendorsTask, cssVendorsTask)
);

exports.default = gulp.series(
  gulp.series(jsTask, scssTask),
  cacheBustTask,
  watchTask
);