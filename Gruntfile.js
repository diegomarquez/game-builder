module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  var getDocsSources = function(args) {
    var result = [];

    for (var i=0; i<args.src.length; i++) {
        for (var j=0; j<args.types.length; j++) {
          result.push(args.src[i] + "/**/*" + args.types[j]);
        }
    }

    result.push('README.md');

    return result;
  }

  grunt.initConfig({   
    groc: {
      javascript: getDocsSources(pkg.docs),
      options: {
        'out': 'deploy/docs/',
        'except': ['node_modules/**'],
        'index-page-title': 'Game Builder Examples Docs',
        'github': false
      }
    },

    shell: {
        rm: { 
          command: function(folder) { 
            return 'rm -rf ' + folder; 
          }
        },

        clone: {
          command: function() { 
            return 'git clone -b ' + pkg.repo.branch + ' ' + pkg.repo.master + ' ' + 'deploy' 
          } 
        },

        cp: {
          command: function(folder) { 
            return 'cp -rf ' + folder + '/ ' + 'deploy' + '/'+ folder +'/' 
          }
        },

        push: {
          command: [
            'cd deploy',
            'git add .',
            'git diff --quiet --exit-code --cached || git commit -m "Pushed by grunt on"' + '<%= grunt.template.today("yyyy-mm-dd") %>',
            'git push -f'
          ].join('&&')
        },

        curl: {
          command: function(url, output) {
            return 'curl --create-dirs ' + url + ' -o ' + output;
          }
        },

        options: { stdout: true, failOnError: true }
    }
  });

  grunt.loadNpmTasks('grunt-groc');
  grunt.loadNpmTasks('grunt-shell');

  var getCopyTargets = function(args) {
    var result = [];

    for(var i=0; i<args.length; i++) {
      result.push("shell:cp:" + args[i]);
    }

    return result;
  }

  var getCurlTargets = function(args) {
    var result = [];

    for(var k in args) {
      var path = args[k];
      var output = k;
      var extension = path.slice(path.lastIndexOf('.'))

      result.push("shell:curl:" + path + ":lib/" + output + extension);
    }

    return result;
  }

  grunt.registerTask('remove', [
    grunt.template.process('shell:rm:deploy')
  ]);

  grunt.registerTask('copy', 
    getCopyTargets(pkg.src.local)
  );

  grunt.registerTask('to-gh-pages', [
    'remove',   
    'shell:clone',
    'groc', 
    'copy',
    'shell:push',
    'remove'
  ]);

  grunt.registerTask('get-deps', 
    getCurlTargets(pkg.src.remote)
  );
};