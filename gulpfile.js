var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    autoprefixer= require('gulp-autoprefixer'),
    cleanCSS    = require('gulp-clean-css'),
    rename      = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify');
    pug         = require('gulp-pug');
    path        = require('path');


var config = {
    bootstrapDir: './node_modules/bootstrap/scss',
    tatherDir: './node_modules/tether',
    fontAwesomeDir: './node_modules/font-awesome/scss',
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
    return gulp.src('app/sass/mixins_all.sass')
    .pipe(sass({
        includePaths: [
            config.bootstrapDir, 
            config.tetherDir,  
            config.fontAwesomeDir
        ]
    }).on('error', sass.logError))
    .pipe(rename({basename: 'main', prefix : ''}))
// .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
// .pipe(cleanCSS())
    .pipe(gulp.dest(config.publicDir + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/bethesda/config.js',
        'node_modules/jquery/dist/jquery.js',
        'node_modules/underscore/underscore.js',
        'node_modules/backbone/backbone.js',
        'node_modules/backbone-validation/dist/backbone-validation.js',
        'app/bethesda/utils.js',
        'node_modules/tether/dist/js/tether.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/requirejs/require.js',
        'app/bethesda/models/user.js',
        'app/bethesda/controllers/app.js'
        ])
        .pipe(concat('libs.js'))
        //.pipe(uglify()) //Minify libs.js
        .pipe(gulp.dest(config.publicDir + '/js'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('./app/bethesda/templates/*.jade')
    .pipe(rename(function (path) {  
        path.extname = ".js"
    }))
    .pipe(pug({
          client: 1,
          // To Do Ask a question: name: path.basename(file.path).replace('.js', ''),
          name: 'newFunc',
          /*
          globals: {
            serverUrl: "http://192.168.0.100:8000",
          },
          */
          debug: 0,
          compileDebug: 0,
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(config.publicDir + '/templates'));
});


gulp.task('watch', function () {
    gulp.watch(['app/sass/*.sass', 'app/sass/**/*.sass',], ['styles']);
    gulp.watch(['app/bethesda/*.js', 'app/bethesda/**/*.js'], ['scripts'])
    gulp.watch(['app/bethesda/templates/*.jade', ], ['views'])
    // gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['watch']);
