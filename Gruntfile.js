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
            return 'git clone ' + pkg.repository + ' ' + "work/" 
          } 
        },

        cp: {
          command: [
            'cp -rf work/src src/',
            'cp -rf work/examples/ examples/',
            'cp -rf work/lib/ lib/'
          ].join('&&')
        },

        groc: {
          command: function(docs) {
            return 'groc "work/**/*.js" "work/**/*.md" "work/README.md" -e "work/lib/**/*.*"'
          }
        },

        bower: {
          command: [
            'cd work/',
            'bower install',
            'cd ..',
          ].join('&&')
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

  grunt.registerTask('publish', [
    'shell:rm:work',
    'shell:rm:doc',
    'shell:rm:lib',
    'shell:clone',
    'shell:bower',
    'shell:groc', 
    'shell:cp',
    'shell:rm:work',
    'shell:push'
  ]);
};