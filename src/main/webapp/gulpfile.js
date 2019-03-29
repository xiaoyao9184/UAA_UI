var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var sequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var wiredep = require('wiredep').stream;
var connect = require('gulp-connect');
var ngConstant = require('gulp-ng-constant');
var inject = require('gulp-inject');

var config = {
    //https://symfonycasts.com/screencast/gulp/minify-only-production
    dev: !!gutil.env.dev
};

gulp.task('clean', function() {
    return gulp.src(['./dist','./temp'])
       .pipe(clean({force: true}));
});

gulp.task('bower', function () {
    return gulp.src(['./*.html','!./home.html'])
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('./temp'));
});

gulp.task('config', function () {
    return gulp.src('./config.json')
        .pipe(ngConstant({
          name: 'uaaUIApp',
          deps: false
        }))
        .pipe(gulp.dest('./temp'));
});

gulp.task('usemin-index', function () {
    if(config.dev){
        console.info('DEV mode!');
        return gulp.src(['./temp/*.html'])
            .pipe(usemin())
            .pipe(gulp.dest('./dist'))
            .pipe(config.dev ? connect.reload(): gutil.noop());
    }
    var sources = gulp.src(['./temp/config.js'], {read: false});
    return gulp.src(['./temp/*.html'])
        .pipe(config.dev ? gutil.noop():inject(sources))
        .pipe(usemin({
            css: [ cleanCSS(), 'concat' ],
            html: [ function () {
                // https://github.com/jonschlinkert/gulp-htmlmin
                // https://github.com/kangax/html-minifier
                return htmlmin({
                    html5: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeOptionalTags: true
                });
            } ],
            //https://github.com/zont/gulp-usemin/issues/60
            vendorjs: [
                sourcemaps.init(),
                uglify(),
                sourcemaps.write('./')
            ],
            js: [ 
                sourcemaps.init(), 
                //https://stackoverflow.com/questions/32741259/angular-unknown-provider-after-minification
                //https://stackoverflow.com/questions/26854817/how-to-troubleshoot-angular-js-unknown-provider-error-in-minified-code
                ngAnnotate(),
                uglify(), 
                sourcemaps.write('./')
            ],
            inlinejs: [ uglify(), 'concat' ],
            inlinecss: [ cleanCSS(), 'concat' ]
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(config.dev ? connect.reload(): gutil.noop());
});

gulp.task('min-templates', function () {
    return gulp.src(['./scripts/**/*.html'])
        .pipe(config.dev ? gutil.noop() : htmlmin())
        .pipe(gulp.dest('./dist/scripts'))
        .pipe(config.dev ? connect.reload(): gutil.noop());
});

gulp.task('copy-fonts', function () {
    return gulp.src(['./bower_components/bootstrap/fonts/*'])
        .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('copy-images', function () {
    return gulp.src(['./assets/images/*'])
        .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('copy-other', function () {
    return gulp.src(['./favicon.ico', 'robots.txt'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', function (callback) {
    sequence(
        'clean', 
        'config',
        'bower',
        'usemin-index', 
        'min-templates',
        'copy-fonts',
        'copy-images',
        'copy-other',
        callback)
})

gulp.task('connect', function () {
    connect.server({
        root: './dist/',
        port: 3000,
        livereload: config.dev
    });
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['bower']);
    gulp.watch(['./favicon.ico', 'robots.txt'], ['copy-other']);
    gulp.watch(['./bower_components/bootstrap/fonts/*'], ['copy-fonts']);
    gulp.watch(['./scripts/**/*.html'], ['min-templates']);
    gulp.watch(['./scripts/**/*.js', './temp/*.html'], ['usemin-index']);
});

if(config.dev){
    gulp.task('default', ['connect', 'watch']);
}else{
    gulp.task('default', ['connect']);
}
