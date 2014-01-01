module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({   
    shell: {
        rm: { 
          command: function(folder) { 
            return 'rm -rf ' + folder; 
          }
        },

        clone: {
          command: function() { 
            return 'git clone ' + pkg.examplesRepository + ' ' + "work/" 
          } 
        },

        cp: {
          command: [
            'cp -rf work/game-builder game-builder/',
            'cp -rf work/lib/ lib/',
            'cp -rf work/examples/ examples/'
          ].join('&&')
        },

        groc: {
          command: function(folder) {
            var obj = { folder: folder };
            var command = 'groc "work/<%= folder %>/**/*.js" "work/<%= folder %>/**/*.md" "work/<%= folder %>/README.md" -o ./<%= folder %>-docs';
            return grunt.template.process(command, {data: obj});
          }
        },

        bower: {
          command: 'bower install'
        },

        push: {
          command: [
            'git add .',
            'git diff --quiet --exit-code --cached || git commit -m "Pushed by grunt on "' + '<%= grunt.template.today("yyyy-mm-dd") %>',
            'git push -f'
          ].join('&&')
        },

        options: { stdout: true, failOnError: true }
    }
  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('clean', [
    'shell:rm:work',
    'shell:rm:examples-docs',
    'shell:rm:game-builder-docs',
    'shell:rm:game-builder',
    'shell:rm:lib',
    'shell:rm:bower_components'
  ]);

  grunt.registerTask('download', [
    'shell:clone',
    'shell:bower'
  ]);

  grunt.registerTask('generateDocs', [
    'shell:groc:examples',
    'shell:groc:game-builder'
  ]);

  grunt.registerTask('push', [
    'shell:cp',
    'shell:rm:work',
    'shell:push'
  ]);

  grunt.registerTask('publish', [
    'clean',
    'download',  
    'generateDocs',
    'push'
  ]);
};