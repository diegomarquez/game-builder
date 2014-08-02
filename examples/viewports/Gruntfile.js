var path = require('path')

module.exports = function(grunt) {
  var t = grunt.template.process;
  var p = grunt.file.readJSON('package.json');

  // Making sure that this path has the correct separator. Just in case.
  p.framework = p.framework.split(/[/|\\]/).join(path.sep);

  grunt.initConfig({
    pkg: p,

    shell: {
      // Run bower from grunt.
      bower: { 
        command: 'bower install' 
      },

      // Clone game-builder from github
      framework: {
        command: t('git clone -b <%= p.frameworkTag %> <%= p.frameworkRepo %> <%= p.framework %>', {data: {p:p}}) 
      }
    },

    clean: {
      // Clean the folder where game-builder is downloaded
      target: {
        src: [path.join(p.framework)],
      },

      options: { force: true }
    },

    bower: {
      // Generate requirejs configuration from bower components
      requireJS: { rjsConfig: 'config.js' }
    },

    open: {
      // Open index.html with the default browser
      index : { path : 'index.html' }
    },

    // Merge files to create asset-map.js
    "merge-json": {
      map: {
        src: [ 'asset-map.js', "remote-assets.json"],
        dest: 'asset-map.js'
      }
    },

    // Prepend a variable declaration in asset-map.js
    file_append: {
      default_options: {
        files: {
          'asset-map.js': {
            prepend: "var assetMap = "
          }
        }
      }
    }
  });

  // Npm goodness
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bower-requirejs');
  grunt.loadNpmTasks('grunt-merge-json');
  grunt.loadNpmTasks('grunt-file-append');

  // Local tasks
  grunt.loadTasks('tasks');

  // This task creates the asset map 
  grunt.registerTask('asset-map', ['local-assets', 'merge-json', 'file_append']);
  // This task creates all the requirejs configuration needed
  grunt.registerTask('config', ['create-config', 'bower:requireJS']);
  // This task downloads game-builder source code
  grunt.registerTask('framework', ['clean', 'shell:framework']);
  // This task opens index.html
  grunt.registerTask('run', ['open:index']);
  // This task 
    // downloads any bower components
    // downloads game-builder source
    // generates requirejs configuration
    // generates the local and remote asset map
  grunt.registerTask('build', ['shell:bower', 'framework', 'config', 'asset-map']);

  // The default task get's all dependencies, generates everything needed and finally opens index.html 
  grunt.registerTask('default', ['build', 'run']);
};