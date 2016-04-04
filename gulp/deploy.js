'use strict';

var gulp = require('gulp');
var ftp = require('gulp-ftp');
var conf = require('./conf');
var path = require('path');

gulp.task('tmp', function(){
  return gulp.src(conf.paths.dist + '/**/*.*')
    .pipe(ftp({
      host: 'workfield.hol.es',
      remotePath: '/public_html',
      port: 21,
      user: 'u777210704',
      pass: 'mv4WGAr0tF'
    }));
})

gulp.task('deploy', ['clean', 'build'], function() {
  return gulp.src(conf.paths.dist + '/**/*.*')
    .pipe(ftp({
      host: 'workfield.hol.es',
      remotePath: '/public_html',
      port: 21,
      user: 'u777210704',
      pass: 'mv4WGAr0tF'
    }));
});
