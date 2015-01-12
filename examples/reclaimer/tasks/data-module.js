var path = require('path');

module.exports = function(grunt) {
  grunt.registerMultiTask('create-data-module', function() {		
		for (var i = 0; i < this.files.length; i++) {
			var file = this.files[i];

			var src = file.src;
			var dest = file.dest;
			
			// Process the template 
			var r = grunt.template.process(grunt.file.read('tasks/templates/data-module-template.txt'), { 
				data: { 		
					data: grunt.file.read(src)
				}
			});
			
			var extension = path.extname(src);

			// Destination path
			var name = dest + path.basename(src, extension) + '.js';

			// Delete the file if it already exists
			if (grunt.file.isFile(name)) {
		      grunt.file.delete(name, {force: true});  
		    }

		    // Write the file
		    grunt.file.write(name, r);
		};
	});
}
