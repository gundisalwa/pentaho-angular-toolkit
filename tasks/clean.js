'use strict';

var $	 	= require('../gulp.config.js');
var del 	= require('del');

/**
 * Remove all files from the dist folder
 */
 module.exports = function() {
    $.log('Cleaning dist folders');

    return del.sync([$.dist_path, $.module.dist_path]);
};