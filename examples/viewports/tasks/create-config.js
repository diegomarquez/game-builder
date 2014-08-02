var path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('create-config', function() {
		var p = grunt.file.readJSON('package.json');

	  	// Making sure that this path has the correct separator. Just in case.
	  	p.additionalSrcPaths = p.additionalSrcPaths ? p.additionalSrcPaths.split(/[/|\\]/).join(path.sep) : "";
	  	p.framework 		 = p.framework.split(/[/|\\]/).join(path.sep);
	  	p.lib 				 = p.lib.split(/[/|\\]/).join(path.sep);

	    var paths = [];

	    // Add all source paths
	    paths.push(p.additionalSrcPaths);
	    paths.push(p.framework);
	    paths.push(p.lib);
	    paths.push('src');

	    // Create array with all the file paths in the source paths provided
	    var files = [];
	    var glob = '/**/*.js'; 

	    for(var i=0; i<paths.length; i++) {
	      if(paths[i] != "") {
	        files = files.concat(grunt.file.expand(paths[i] + glob));  
	      }
	    }

	    // Create path objects to create the needed requirejs configuration for each file
	    paths = [];

	    for(var i=0; i<files.length; i++) {
	      var base = path.basename(files[i], '.js');
	      var dir = path.dirname(files[i]);
	      var p = dir + path.sep + base;
	    
	      paths.push({alias:base, path:p});
	    }

	    // Contribed template to generate requirejs configuration
	    var r = grunt.template.process('require.config({ \n\t paths: { \n\t\t <% paths.forEach(function(pathObject) { %>"<%= pathObject.alias %>": "<%= pathObject.path %>", \n\t\t <% }); %> \n\t } \n });', 
	    {data: { paths: paths }});

	    // Write the contents of processing the previous template into config.js
	    // If the file already exists, it is deleted
	    var name = 'config.js'
	    if (grunt.file.isFile(name)) {
	      grunt.file.delete(name, {force: true});  
	    }
	    grunt.file.write(name, r);
  	});
};