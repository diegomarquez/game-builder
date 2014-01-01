module.exports = function(grunt) {
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),

  	shell: {
  		yo: {
  			command: 'yo game-builder:build-index --force '
  		}
  	},

  	open: {
  		index : {
    	  path : 'index.html'
    	}
  	}
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('refresh', ['shell:yo']);
  grunt.registerTask('run', ['open:index']);

  grunt.registerTask('default', ['refresh', 'run']);
};