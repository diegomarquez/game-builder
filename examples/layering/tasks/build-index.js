var cheerio = require('cheerio');

module.exports = function(grunt) {
    grunt.registerMultiTask('create-build-index', function() {		
		var options = this.options();
	
		var p = grunt.file.readJSON('package.json');

		// Get all the tags which are not scripts in the body of the ./index.html
		var $ = cheerio.load(grunt.file.read('index.html'));
		// Remove script tags
		$('body').find('script').remove();
		// Remove comment nodes
		$('body').contents().each(function() {
        if(this.nodeType == 8) {
            $(this).remove()
        }
    });

		p.body = $('body').html().replace(/^\s*[\r\n]/gm, '').trim(); 

		// Process the template 
		var r = grunt.template.process(grunt.file.read('tasks/templates/index-template.txt'), { 
			data: p 
		});

		// Destination path
		var name = options.buildDir + 'index.html';

		// Delete the file if it already exists
		if (grunt.file.isFile(name)) {
	      grunt.file.delete(name, {force: true});  
	    }

	    // Write the file
	    grunt.file.write(name, r);	
	});
}
