//HELP: To refresh dictionary files, grunt dictionary --dictionary

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  var gruntOptions = {}

  gruntOptions['shell'] = {
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
          var command = 'groc "work/<%= folder %>/**/*.js" "work/<%= folder %>/**/*.md" "work/<%= folder %>/README.md" -i "work/<%= folder %>/README.md" -o ./<%= folder %>-docs -e "work/<%= folder %>/**/Gruntfile.js"';
          return grunt.template.process(command, {data: obj});
        }
      },

      bower: {
        command: 'bower install'
      },

      push: {
        command: [
          'git add . -A',
          'git diff --quiet --exit-code --cached || git commit -m "Pushed by grunt on "' + '<%= grunt.template.today("yyyy-mm-dd") %>',
          'git push -f'
        ].join('&&')
      },

      options: { stdout: true, failOnError: true }
  }

  if(grunt.option('dictionary')) {
    gruntOptions['linkJSON'] = {
      gameBuilder: {
        paths: ["**/*.js"],
        cwd: "work/game-builder/",
        prefix: "http://diegomarquez.github.io/game-builder/game-builder-docs/",
        suffix: ".html",
        output: "game-builder-dictionary.json"
      },
      examples: {
        paths: ["**/*.js"],
        cwd: "work/examples/",
        prefix: "http://diegomarquez.github.io/game-builder/examples-docs/",
        suffix: ".html",
        output: "examples-dictionary.json"
      }
    }
  }
  else {
    gruntOptions['replace'] = {
      gameBuilder: {
        files: [
          {expand: true, src: ["work/game-builder/**/*.js"]}
        ],
        options: {
          patterns: [{
            json: grunt.file.readJSON('game-builder-dictionary.json')
          }],
          force: true
        }
      },
      examples: {
        files: [
          {expand: true, src: ["work/examples/**/*.js"]}
        ],
        options: {
          patterns: [{
            json: grunt.file.readJSON('examples-dictionary.json')            
          }],
          force: true
        }
      }
    }
  }

  grunt.initConfig(gruntOptions);

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('clean', [
    'shell:rm:work',
    'shell:rm:examples',
    'shell:rm:examples-docs',
    'shell:rm:game-builder-docs',
    'shell:rm:game-builder',
    'shell:rm:lib',
    'shell:rm:bower_components'
  ]);

  grunt.registerTask('docs', [
    'clean',
    'shell:clone',
    'shell:bower',
    'replace',
    'shell:groc:examples',
    'shell:groc:game-builder',
    'shell:cp',
    'shell:rm:work'
  ]);

  grunt.registerTask('publish', [
    'docs',
    'shell:push'
  ]);

  grunt.registerTask('dictionary', [
    'clean',
    'shell:clone',
    'linkJSON',
    'clean'
  ]);

  grunt.registerMultiTask("linkJSON", "Build a link JSON", function() {
      var paths = grunt.file.expand({cwd:this.data.cwd}, this.data.paths );
      var out = this.data.output;
      var prefix = this.data.prefix;
      var suffix = this.data.suffix;
      var contents = "";

      var dictionary = {};

      paths.forEach(function( path ) {
        var alias = path.match(/(\w+)\.js$/)[1];
        dictionary[alias] = prefix + path.replace(/\.js$/, suffix);
      });

      grunt.file.write(out, JSON.stringify(dictionary, undefined, 2 ));
  });
};