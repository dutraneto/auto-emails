const { src, watch, series, parallel, dest, task } = require('gulp')
const del = require('del')
const gulpLess = require('gulp-less')
const inlineCss = require('gulp-inline-css')
const browserSync = require('browser-sync').create()

// input files
const input = {
    root: '/',
    all: '**/*.*',
    lessPath: '_/less/*',
    imgPath: '_/img/*',
    htmlPath: 'index.html',
    port: 4000,
}

const output = {
    public: 'public',
    cssPath: 'public/css/',
    imgPath: 'public/img/',
    htmlPath: 'public/index.html',
}

/** FUNCTIONS --------*/
// serve files
const serve = () => {
    watch(input.lessPath).on('change', series('buildAll', reloadBrowser))
    watch(input.htmlPath).on('change', series('buildAll', reloadBrowser))

    browserSync.init({
        browser: 'Google Chrome',
        watch: true,
        server: {
            baseDir: output.public,
        },
        port: input.port,
    })
}

// function that reloads browsers
const reloadBrowser = () => browserSync.reload()

// clear the cache browser
const clearCache = () => cache.clearAll()

const buildCss = () => {
    return src(input.lessPath)
        .pipe(gulpLess())
        .pipe(dest(output.cssPath))
        .pipe(browserSync.stream())
}

// Compile Templates
const buildHtml = () => {
    return src(input.htmlPath)
        .pipe(
            inlineCss({
                applyStyleTags: true,
                applyLinkTags: true,
                removeStyleTags: false,
                removeLinkTags: true,
            })
        )
        .pipe(dest(output.public))
}

// Optimize images
const buildImg = () => {
    return src(input.imgPath).pipe(dest(output.imgPath))
}

// Clean public and tmp
const cleanBuild = () => del([output.public, 'tmp/**/*'])

/** TASKS --------*/
task('serve', () => serve())
task('buildHtml', () => buildHtml())
task('buildCss', () => buildCss())
task('buildImg', () => buildImg())
// clear image caches
task('clearCache', () => clearCache())
task('cleanBuild', () => cleanBuild())

task('buildAll', series('cleanBuild', 'buildCss', 'buildHtml', parallel('buildImg')))
