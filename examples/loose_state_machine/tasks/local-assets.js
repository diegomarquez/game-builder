var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('local-assets', function() {
		var p = grunt.file.readJSON('package.json');

	  	// Making sure that this path has the correct separator. Just in case.
	  	p.additionalAssetPaths = p.additionalAssetPaths ? p.additionalAssetPaths.split(/[/|\\]/).join(path.sep) : "";
	  	
	    var paths = [];

	    // Add all assets paths
	    paths.push(p.additionalAssetPaths);
	    paths.push('assets');

	    // Create array with all the file paths in the source paths provided
	    var files = [];
	    var glob = '/**/*.*'; 

	    for(var i=0; i<paths.length; i++) {
	      if(paths[i] != "") {
	        files = files.concat(grunt.file.expand(paths[i] + glob));  
	      }
	    }

	    paths = {};

	    for(var i=0; i<files.length; i++) {
	      var file = files[i];

	      var base = path.basename(file);
	      var dir = path.dirname(file);

		  // Save each path with a corresponding key
	      paths[base.toUpperCase()] = dir + path.sep + base;
	    }

	    // Write the contents of processing the previous template into config.js
	    // If the file already exists, it is deleted
	    var name = 'asset-map.js'
	    if (grunt.file.isFile(name)) {
	      grunt.file.delete(name, {force: true});  
	    }
	    grunt.file.write(name, JSON.stringify(paths, null, '\t'));
  	});
};