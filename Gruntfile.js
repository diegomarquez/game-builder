module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  
  pkg.projectRoot = pkg.projectRoot[grunt.option('dictionary')];

  var gruntOptions = {}

  gruntOptions['pkg'] = pkg;

  gruntOptions['shell'] = {
      rm: { 
        command: function(folder) { 
          return 'rm -rf ' + folder; 
        }
      },

      clone: {
        command: function() { 
          return "git clone <%= pkg.examplesRepository %> work/"
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
          var obj = { 
            folder: folder,
            work: "work/" + folder 
          };

          var command = 'groc "<%= work %>/**/*.js" "<%= work %>/**/*.md" "<%= work %>/README.md" -i "<%= work %>/README.md" -o ./<%= folder %>-docs -e "<%= work %>/**/Gruntfile.js" -t "work/"';
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
        prefix: "<%= pkg.projectRoot %>/game-builder-docs/",
        suffix: ".html",
        output: "game-builder-dictionary.json"
      },
      examples: {
        paths: ["**/*.js"],
        cwd: "work/examples/",
        prefix: "<%= pkg.projectRoot %>/examples-docs/",
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

  if(grunt.option('dictionary')) {
    grunt.registerTask('default', [
      'clean',
      'shell:clone',
      'linkJSON',
      'clean'
    ]);      
  }else {
    grunt.registerTask('default', [
      'docs',
      'shell:push'
    ]);
  }
};