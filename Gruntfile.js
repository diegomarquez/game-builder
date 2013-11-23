module.exports = function(grunt) {
  var deployFolder = 'deploy';
  var srcPath = 'src';
  var examplesPath = 'examples';
  var repo = 'git@github.com:diegomarquez/test-grunt-file.git';

  grunt.initConfig({  
    groc: {
      javascript: [srcPath + '/**/*.js', srcPath + '/**/*.md', 'README.md'],
      options: {
        'out': deployFolder + '/docs/',
        'except': ['node_modules/**'],
        'index-page-title': 'Examples Docs',
        'github': false
      }
    },

    shell: {
        rm: { 
          command: 'rm -rf ' + deployFolder, 
          options: { stdout: true, failOnError: true }
        },

        clone: {
          command: 'git clone -b gh-pages ' + repo + ' ' + deployFolder,
          options: { stdout: true, failOnError: true }
        },

        cp_src: {
          command: 'cp -rf ' + srcPath + '/ ' + deployFolder + '/'+ srcPath +'/',
          options: { stdout: true, failOnError: true }
        },

        cp_examples: {
          command: 'cp -rf ' + examplesPath + '/ ' + deployFolder + '/'+ examplesPath +'/',
          options: { stdout: true, failOnError: true }
        },

        push: {
          command: [
            'cd ' + deployFolder,
            'git add .',
            'git commit --message "Pushed by grunt on"' + '<%= grunt.template.today("yyyy-mm-dd") %>',
            'git push --force'
          ].join('&&'),
          options: { stdout: true, failOnError: false }
        }
    }
  });

  grunt.loadNpmTasks('grunt-groc');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('deploy', [
    'shell:rm', 
    'shell:clone',
    'groc', 
    'shell:cp_src',
    'shell:cp_examples',
    'shell:push',
    'shell:rm'
  ]);
};