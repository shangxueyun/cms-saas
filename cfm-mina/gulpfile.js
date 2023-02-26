var gulp = require('gulp');
 
var postcss = require('gulp-postcss');
 
var pxtorem = require('postcss-pxtransform');
 
gulp.task('css', function() {
 
var processors = [
 
pxtorem({
 
platform: 'weapp',
 
designWidth: 750,
 
})
 
];

return gulp.src(['miniprogram_npm/@vant/**/*.wxss'])
    .pipe(postcss(processors))
    .pipe(gulp.dest('miniprogram_npm/@vant/'));
 
});