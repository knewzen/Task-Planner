let gulp      = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer');


  // Static Server + watching js/sass/html files
gulp.task('serve', ['sass'], ()=>
{

  browserSync.init({
    server: "./dist"
  });

  gulp.watch("dist/**/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', ()=>
{
  return gulp.src("src/sass/main.sass")
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer())
    .pipe(gulp.dest("dist/css")).pipe(browserSync.stream());
});

// Bundls all js files in dist folder & auto-inject into browsers
gulp.task('compileJS', ()=>
{
  return gulp.src(['src/app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./dist/js')).pipe(browserSync.stream());
});

// Moves html templates in the dist folder & auto-inject into browsers
gulp.task('templates', ()=>
{
  return gulp.src(['src/app/**/*.html'])
  .pipe(gulp.dest('./dist/templates')).pipe(browserSync.stream());

})

gulp.task('watch', ()=>
{
  gulp.watch("src/sass/**/*.sass", ['sass']);
  gulp.watch("src/app/**/*.js", ['compileJS']);
  gulp.watch("src/app/**/*.html", ['templates']);
})

gulp.task('default', ['templates', 'sass', 'compileJS', 'watch', 'serve']);
