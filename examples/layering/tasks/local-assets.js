var path = require('path');

module.exports = function(grunt) {
    grunt.registerMultiTask('local-assets', function() {
			var p = grunt.file.readJSON('package.json');
			var options = this.options();

	    var paths = this.data.src;

	    var options = {
	    	cwd: this.data.cwd
	    }

	    var files = [];

    	for(var i = 0; i < paths.length; i++) {
	      if(paths[i] != "") {
	      	files = files.concat(grunt.file.expandMapping(paths[i] + '/**/*.*', '', options).map(function(match) {
	      		return match.dest; 
	      	}));
	      }
	    }

	    paths = {};

	    for(var i = 0; i < files.length; i++) {
	      var file = files[i];

	      var base = path.basename(file);
	      var dir = path.dirname(file);

		  	// Save each path with a corresponding key
	      paths[base.toUpperCase()] = dir + path.sep + base;
	    }

	    // Write the contents of processing the previous template into config.js
	    // If the file already exists, it is deleted
	    var name = this.options().generatedDir + 'asset-map.json';

	    if (grunt.file.isFile(name)) {
	      grunt.file.delete(name, {force: true});  
	    }

	    grunt.file.write(name, JSON.stringify(paths, null, '\t'));
  	});
};