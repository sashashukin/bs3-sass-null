
var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	browserSync 	= require('browser-sync'),
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglifyjs'),
	cssnano     	= require('gulp-cssnano'),
	rename      	= require('gulp-rename'),
	del          	= require('del'),
	imagemin    	= require('gulp-imagemin'),
	pngquant     	= require('imagemin-pngquant'),
	cache        	= require('gulp-cache'),
	autoprefixer 	= require('gulp-autoprefixer');



// !!! Минификация



/*
 * Libs bower bootstrap copy fonts and scripts to common
 */

gulp.task('libs-bower-bootstrap-fonts-copy', function() {
	return gulp.src('app/libs-bower/bootstrap-sass/assets/fonts/bootstrap/*.*')
		.pipe(gulp.dest('app/libs/bootstrap/fonts'));
});

gulp.task('libs-bower-bootstrap-scripts-copy', function() {
	return gulp.src([
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/button.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
			'app/libs-bower/bootstrap-sass/assets/javascripts/bootstrap/popover.js'
		])
		.pipe(concat('bootstrap.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/libs/bootstrap/js'));
});



/*
 * Libs bower bootstrap copy scss to customize and convert to sass
 */

gulp.task('libs-bower-bootstrap-scss-copy-attachments-to-customize', function() {
	return gulp.src('app/libs-bower/bootstrap-sass/assets/stylesheets/bootstrap/**/*.scss')
		.pipe(gulp.dest('app/libs-my/bootstrap-customize/scss/bootstrap'))
});

gulp.task('libs-bower-bootstrap-scss-copy-main-to-customize', function() {
	return gulp.src('app/libs-bower/bootstrap-sass/assets/stylesheets/_bootstrap.scss')
		.pipe(rename('bootstrap.scss'))
		.pipe(gulp.dest('app/libs-my/bootstrap-customize/scss'))
});

gulp.task('libs-bower-bootstrap-scss-copy-all-to-customize', ['libs-bower-bootstrap-scss-copy-attachments-to-customize', 'ibs-bower-bootstrap-scss-copy-main-to-customize']);

// sass-convert -R app/libs-my/bootstrap-customize/scss app/libs-my/bootstrap-customize/sass --from scss --to sass



/*
 * Bootstrap customize sass to css
 */

gulp.task('sass-bootstrap-customize', function() {
	return gulp.src('app/libs-my/bootstrap-customize/sass/**/*.sass')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/libs/bootstrap/css'))
		.pipe(browserSync.reload({stream: true}));
});



/*
 * Sass to css
 */

gulp.task('sass-common', function() {
	return gulp.src('app/sass/**/*.sass')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});



/*
 * Img
 */

gulp.task('img-build', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});



/*
 * Browser sync
 */

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});



/*
 * Watch
 */

gulp.task('watch', ['browser-sync', 'sass-bootstrap-customize', 'sass-common'], function() {
	gulp.watch('app/libs-my/bootstrap-customize/sass/**/*.sass', ['sass-bootstrap-customize']);
	
	gulp.watch('app/sass/**/*.sass', ['sass-common']);
	
	gulp.watch([
		'app/css/**/*.css',
		'app/js/**/*.js',
		'app/libs/**/*',
		'app/plugins/**/*',
		'app/*.html'
	], browserSync.reload);
});



/*
 * Build
 */
 
gulp.task('dist-clean', function() {
    return del.sync('dist');
});


gulp.task('build', ['dist-clean', 'libs-bower-bootstrap-fonts-copy', 'libs-bower-bootstrap-scripts-copy', 'sass-bootstrap-customize', 'sass-common', 'img-build'], function() {

    gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

    gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css'));

    gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'));

    gulp.src('app/libs/**/*')
		.pipe(gulp.dest('dist/libs'));

    gulp.src('app/plugins/**/*')
		.pipe(gulp.dest('dist/plugins'));

    gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));

});



/*
 * Cache
 */

gulp.task('cache-clear', function () {
    return cache.clearAll();
});



/*
 * Task default
 */

gulp.task('default', ['watch']);
