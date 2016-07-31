var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS    = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    browserSync  = require('browser-sync').create(),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify');


var config = {
    bootstrapDir: './node_modules/bootstrap/scss',
    publicDir: './app/html',
};

gulp.task('browser-sync', ['styles', 'scripts'], function() {
    browserSync.init({
        server: {
                    baseDir: config.publicDir
                },
        notify: false
    });
});

gulp.task('styles', function () {
    return gulp.src('app/sass/entry.sass')
    .pipe(sass({
        includePaths: [config.bootstrapDir, './node_modules/tether/',  './node_modules/font-awesome/scss']
    }).on('error', sass.logError))
    .pipe(rename({basename: 'main', prefix : ''}))
// .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
// .pipe(cleanCSS())
    .pipe(gulp.dest(config.publicDir + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src([
    ])
    .pipe(concat('libs.js'))
    // .pipe(uglify()) //Minify libs.js
    .pipe(gulp.dest(config.publicDir + '/js/'));
});

gulp.task('watch', function () {
    gulp.watch(['app/sass/*.sass', 'app/sass/**/*.sass',], ['styles']);
    // gulp.watch('app/libs/**/*.js', ['scripts']);
    // gulp.watch('app/js/*.js').on("change", browserSync.reload);
    // gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
