import { src, dest, series, parallel, watch } from 'gulp'
import fs from 'node:fs'
import * as sassCompiler from 'sass'
import gulpSass from 'gulp-sass'
import postcss from 'gulp-postcss'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import htmlmin from 'gulp-html-minifier-terser'
import rename from 'gulp-rename'
import imagemin from 'gulp-imagemin'
import imageminWebp from 'imagemin-webp'
import browserSyncModule from 'browser-sync'
import browserSyncConfig from './browser-sync.config.js'

const sass = gulpSass(sassCompiler)
const browserSync = browserSyncModule.create()

const paths = {
	scss: 'src/scss/**/*.scss',
	scssEntry: 'src/scss/main.scss',
	js: 'src/js/**/*.js',
	jsEntry: 'src/js/main.js',
	html: 'src/html/**/*.html',
	img: 'src/img/**/*',

	public: 'public',
	cssDest: 'public/css',
	jsDest: 'public/js',
	imgDest: 'public/img',
}

function clean(done) {
	fs.rmSync(paths.public, { recursive: true, force: true })
	done()
}

function stylesDev() {
	return src(paths.scssEntry)
		.pipe(
			sass({ outputStyle: 'expanded', loadPaths: ['src/scss'] }).on(
				'error',
				sass.logError,
			),
		)
		.pipe(postcss({ env: 'development' }))
		.pipe(rename('style.css'))
		.pipe(dest(paths.cssDest))
}

function stylesProd() {
	return src(paths.scssEntry)
		.pipe(
			sass({ outputStyle: 'expanded', loadPaths: ['src/scss'] }).on(
				'error',
				sass.logError,
			),
		)
		.pipe(postcss({ env: 'production' }))
		.pipe(rename('style.css'))
		.pipe(dest(paths.cssDest))
}

function scriptsDev() {
	return src(paths.jsEntry).pipe(babel()).pipe(dest(paths.jsDest))
}

function scriptsProd() {
	return src(paths.jsEntry)
		.pipe(babel())
		.pipe(uglify())
		.pipe(dest(paths.jsDest))
}

function htmlDev() {
	return src(paths.html).pipe(dest(paths.public))
}

function htmlProd() {
	return src(paths.html)
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(dest(paths.public))
}

function images() {
	return src(paths.img, { encoding: false })
		.pipe(imagemin([imageminWebp()]))
		.pipe(dest(paths.imgDest))
}

function serve() {
	browserSync.init(browserSyncConfig)
}

function reload(done) {
	browserSync.reload()
	done()
}

function watchFiles() {
	watch(paths.scss, series(stylesDev, reload))
	watch(paths.js, series(scriptsDev, reload))
	watch(paths.html, series(htmlDev, reload))
	watch(paths.img, series(images, reload))
}

const build = series(clean, parallel(stylesProd, scriptsProd, htmlProd, images))
const dev = series(
	clean,
	parallel(stylesDev, scriptsDev, htmlDev, images),
	parallel(watchFiles, serve),
)

export { build, dev }
export default dev
