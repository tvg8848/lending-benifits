const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
var del = require('del');

gulp.task('server', function () {

	browserSync({
		server: {
			baseDir: "src"
		}
	});

	gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('html', function() {
    return gulp.src(['src/**/*.html', '!src/**/_*.html'])
            .pipe(gulp.dest('build/'))
});

gulp.task('styles', function () {
	return gulp.src("src/sass/**/*.+(scss|sass)")
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer())
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest("src/css"))
		.pipe(browserSync.stream());
});

gulp.task('styles-build', function() {
    return gulp.src(['src/sass/**/*.scss', '!src/sass/**/_*.scss'])
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(gulp.dest("build/css"))
});

gulp.task('images', function() {
    return gulp.src(['src/image/**/*.*'])
            .pipe(gulp.dest('build/image'))
});

gulp.task('clean', function() {
    return del('build/*')
});

gulp.task('watch', function () {
	gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles'));
})

gulp.task('create-build', gulp.parallel('html', 'styles-build', 'images'));

gulp.task('default', gulp.parallel('watch', 'server', 'styles'));
gulp.task('build', gulp.series('clean', 'create-build'));