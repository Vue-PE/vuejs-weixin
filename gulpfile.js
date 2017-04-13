var gulp = require('gulp');
var webpack = require('gulp-webpack');
var named = require('vinyl-named');

var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var spriter = require('gulp-css-spriter');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
// 项目配置
var app = {
    version: '0.4.3',
    src: './src/',
    build: './build/'
}

// Server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: app.build
        }
    });
});

// ************************************ CSS类 start ************************************
// sass
gulp.task('sass', function () {
    return sass(app.src + 'css/style.scss', {lineNumbers: true})
        .pipe(gulp.dest(app.src + 'css'));
});
// dev
gulp.task('csscopy', ['sass'], function(){
    return gulp.src(app.src + 'css/style.css')
        .pipe(gulp.dest(app.build + 'css'))
        .pipe(reload({stream:true}));
});
// build
gulp.task('cssmin', ['csscopy'], function () {
    gulp.src(app.build + 'css/*.css').pipe(cssmin()).pipe(gulp.dest(app.build + 'css'));
});
// ************************************ CSS类 end ************************************

// ************************************ JS类 start ************************************
// dev
gulp.task('webpack', function() {
  return gulp.src(app.src + 'app.js')
    .pipe(named())
    .pipe(webpack(webpackConfig(true)))
    .pipe(gulp.dest(app.build + 'js'))
    .pipe(reload({stream:true}));
});
gulp.task('bundle', function() {
  return gulp.src(app.src + 'app.js')
    .pipe(named())
    .pipe(webpack(webpackConfig(false)))
    .pipe(gulp.dest(app.build + 'js'));
});
gulp.task('copyLibJs', function() {
  return gulp.src(app.src + 'lib/**/*')
    .pipe(gulp.dest(app.build + 'lib'));
});
// build
gulp.task('jsmin', ['bundle', 'copyLibJs'], function () {
    gulp.src(app.build + 'js/*.js').pipe(uglify({mangle: false})).pipe(gulp.dest(app.build + 'js'));
    gulp.src(app.build + 'js/*.map', {read: false}).pipe(clean({force: true}));
});
// ************************************ JS类 end ************************************

// ************************************ IMG类 start ************************************
gulp.task('clean-img', function(){
    return gulp.src(app.build + 'images/', {read: false})
        .pipe(clean({force: true}));
});
// dev or build
gulp.task('img', ['clean-img'], function(){
    return gulp.src(app.src + 'images/**/*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest(app.build + 'images'))
        .pipe(reload({stream:true}));
});
// ************************************ IMG类 end ************************************

// ************************************ FONT类 start ************************************
gulp.task('clean-font', function(){
    return gulp.src(app.build + 'fonts/', {read: false})
        .pipe(clean({force: true}));
});
// dev or build
gulp.task('copyfonts', ['clean-font'], function () {
    gulp.src(app.src + 'fonts/*').pipe(gulp.dest(app.build + 'fonts/')).pipe(reload({stream:true}));;
});
// ************************************ FONT类 end ************************************

// ************************************ HTML类 start ************************************
// dev or build
gulp.task('html', function(){
    return gulp.src(app.src + "*.html")
        .pipe(htmlreplace({
            'css': './css/style.css?v=' + app.version,
            'js': {
                src: null,
                tpl: '<script src="./js/app.js?v=' + app.version + '"></script>'
            }
        }))
        .pipe(gulp.dest(app.build))
        .pipe(reload({stream:true}));
});
// ************************************ HTML类 end ************************************

// 监控
gulp.task('watch', ['csscopy', 'html', 'copyfonts', 'img', 'copyLibJs'], function() {
    gulp.watch(app.src + 'css/**/*.scss', ['csscopy']);
    gulp.watch(app.src + '*.html', ['html']);
    gulp.watch(app.src + 'fonts/**/*', ['copyfonts']);
    gulp.watch(app.src + 'images/**/*', ['img']);
    gulp.watch(app.src + 'lib/**/*', ['copyLibJs']);
});

gulp.task('dev', ['webpack', 'watch', 'browser-sync']);
gulp.task('build', ['cssmin', 'html', 'jsmin', 'copyfonts', 'img']);

// 雪碧图
gulp.task('spriter', ['sass'], function() {
    return gulp.src(app.src + 'css/style.css')
        .pipe(spriter({
            'spriteSheet':app.src + 'images/spriter/sprite.png',
            'pathToSpriteSheetFromCSS':'../images/spriter/sprite.png'
        }))
        .pipe(gulp.dest(app.build + 'css'));
});

function webpackConfig(opt) {
    var config = {
        module: {
            loaders: [
                // 使用插件可以直接import对应格式的文件
                { test: /\.vue$/, loader: 'vue' },
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
            ]
        },
        babel: {
            presets: ['es2015'],
            plugins: ['transform-runtime']
        },
        watch: opt,
        resolve: {
            extensions: ['', '.js', '.vue'],
            modulesDirectories: ['node_modules'],
        },
        devtool: '#source-map'
    };
    return config;
}
