var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var size = require('gulp-size');
var distDir = './dist';
var srcConfig = {
    css: ['./src/css/**/*.css', '!./src/css/**/_*.css'],
    js: './src/js/**/*.js',
    images: './dist/images/**/*'
};
var destConfig = {
    css: distDir + '/css',
    js: distDir + '/js'
}
var browserScope = [
	'last 3 versions',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 12.1',
    'ios >= 6',
    'android >= 4.1',
    'bb >= 10',
    'and_uc 9.9'
];
gulp.task('connect', function() {
    connect.server({
        root: './',
        port: 80,
        livereload: true
    });
});
gulp.task('css', function() {
    var destPath = destConfig.css;
    return gulp.src(srcConfig.css)
    	.pipe(changed(destPath))
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                require('precss')({ /* options */ }),
                cssnext({
                    browsers: browserScope
                })
            ])
        )
        .pipe(sourcemaps.write('./maps'))
        .pipe(size())
        .pipe(
            gulp.dest(destPath)
        );
});
gulp.task('js', function() {
    var destPath = destConfig.js;
    if (!development) {
        destPath = testConfig.js;
    }
    if (production) {
        destPath = wwwConfig.js;
    }
    return gulp.src(srcConfig.js).
    pipe(changed(destPath)).
    pipe(uglify()).
    pipe(size()).
    pipe(gulp.dest(destPath))
});
gulp.task('watch', function() {
    gulp.watch(srcConfig.css, ['css']);
    gulp.watch(srcConfig.js, ['js']);
});
gulp.task('default', function() {
    gulp.start('watch');
    gulp.start('connect');
});
