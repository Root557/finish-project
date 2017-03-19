var	gulp = require('gulp');
var	browserSync = require('browser-sync').create();
var	less = require('gulp-less');
var	path = require('path');
var	LessPluginAutoPrefix = require('less-plugin-autoprefix');
var	autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
var concatCss = require('gulp-concat-css');

var	cssnano  = require('gulp-cssnano'); 
var	rename   = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
var	del      = require('del'); // Подключаем библиотеку для удаления файлов и папок
var	imagemin = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
var	pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
var	cache    = require('gulp-cache'); // Подключаем библиотеку кеширования
	
var	htmlmin  = require('gulp-htmlmin'); //Подключаем библиотеку для минификации html


// compile css from less
gulp.task('less', function () {
	return gulp.src('assets/css/*.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'lib') ],
		plugins: [autoprefix]
	}))
	.pipe(gulp.dest('assets/css/'));
});


gulp.task('browser-sync', function() {
	browserSync.init({
		server: {baseDir: "./"}

	});
});


// gulp.task('scripts', function() {
// 	return gulp.src([ // Берем все необходимые библиотеки
// 		'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
// 		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
// 		])
// 		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
// 		.pipe(uglify()) // Сжимаем JS файл
// 		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
// });

gulp.task('css-libs', ['less'], function() {
	return gulp.src('assets/css/styles.css') // Выбираем файл для минификации
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('assets/css')); // Выгружаем в папку app/css
});

gulp.task('minify', function() {
  return gulp.src('./*.html') //Выбираем файл для минификации
    .pipe(htmlmin({collapseWhitespace: true})) //сжимаем
    .pipe(gulp.dest('dist')); //Выгружаем в папку dist
});

gulp.task('img', function() {
	return gulp.src('assets/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});







// default task
gulp.task('default', function() {

	gulp.run('browser-sync');


	gulp.watch(['assets/css/lib/**', 'assets/css/styles.less'], function(event) {
		gulp.run('less');
	})

	gulp.watch(['assets/css/styles.css', 'index.html']).on('change', browserSync.reload);




})



 
