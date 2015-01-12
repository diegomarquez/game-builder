module.exports = function(grunt) {
  grunt.registerMultiTask('make-dir', function() {		
  	var options = this.options();
		grunt.file.mkdir(options.dirName);		
	});
}
