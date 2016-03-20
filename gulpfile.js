// Load plugins
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var filter = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var browserSync = require('browser-sync');



// Build a paths object
var paths = (function () {
  var obj = {};
  // define root location
  obj.root = './';

  // define development and build locations
  obj.dev = obj.root + 'dev/';
  obj.build = obj.root + 'build/';

  // define sass and compiled css locations
  obj.sass = obj.dev + 'sass/';
  obj.css = obj.build + 'css/';

  // define development and build js locations
  obj.devJS = obj.dev + 'js/';
  obj.buildJS = obj.build + 'js/';

  // define images location
  obj.images = obj.build + 'images/';
  obj.sprites = obj.images + 'sprites/';

  return obj;
})();


// Compile Sass
gulp.task('sass', ['cleanCSS'], function() {
  return gulp.src(paths.sass + '*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(filter('**/*.css'))
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.css));
});


// Compile Sass & pipe through BrowserSync
gulp.task('sass', ['cleanCSS'], function() {
  return gulp.src(paths.sass + '*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .on('success', function(succ) {
    console.log('\033[92msass compilation successful!\033[39m');
  })
  .on('error', function(err) {
    console.log('\033[91m' + err + '\033[39m');
    this.emit('end');
  })
  .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest(paths.css))
  .pipe(filter('**/*.css'))
  .pipe(autoprefixer({
    browsers: ['last 2 versions']
  }))
  .pipe(gulp.dest(paths.css))
  .pipe(browserSync.reload({ stream:true }));
});


// Clean CSS
gulp.task('cleanCSS', function() {
  return del(paths.css);
});


// Clean js build folder
gulp.task('cleanJS', function() {
  return del(paths.buildJS );
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: paths.root
    },
    port: 8080,
    tunnel: false
  });
});


// Lint JS
gulp.task('lint', function() {
  return gulp.src( paths.devJS + '**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(browserSync.reload({ stream:true }));
});


// Copy JS
gulp.task('copyJS', function() {
  return gulp.src([
    paths.devJS + 'app.js'
  ])
  .on('success', function(succ) {
    console.log('\033[92mJavascript copied successfully!\033[39m');
  })
  .on('error', function(err) {
    console.log('\033[91m' + err + '\033[39m');
    this.emit('end');
  })
  .pipe(gulp.dest(paths.buildJS));
});


// Minify CSS
gulp.task('minifyCSS', function() {
  return gulp.src(paths.css + '**/*.css')
  .pipe(minifyCSS({keepSpecialComments:0}))
  .pipe(gulp.dest(paths.css));
});


// Minify JS
gulp.task('minifyJS', function() {
  return gulp.src(paths.buildJS + '*.js')
  .pipe(uglify())
  .pipe(gulp.dest(paths.buildJS));
});


// Watch files for changes
gulp.task('watchAll', function() {

  watch(paths.sass + '**/*.scss', batch(function (events, done) {
    gulp.start('sass', done);
  }));

  watch([ paths.sprites + '**/*.png', 'sprite'], batch(function (events, done) {
    gulp.start(['PNGsprite'], done);
  }));

  watch( paths.devJS + '**/*.js', batch(function (events, done) {
    gulp.start(['lint', 'copyJS'], done);
  }));

});



// A pre build task that is used for both dev and deploy
gulp.task('build', function(callback) {
  runSequence('sass', 'copyJS', callback);
});

//----------------------------------------------------------------------

// Default task
gulp.task('default', function(callback) {
  runSequence('build', 'serve', 'watchAll', callback);
});

// Deployment task
gulp.task('deploy', function(callback) {
  runSequence('build',['minifyCSS', 'minifyJS'], callback);
});
