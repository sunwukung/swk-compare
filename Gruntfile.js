var path = require('path');

module.exports = function(grunt) {
/*global module:false*/
  var p = path.normalize(__dirname);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src : ['lib/k-valid.js', 'test/spec.js']
      }
    },
    jslint: {
      all: {
        src: [
        'lib/k-valid.js',
        'test/spec.js',
        'Gruntfile.js'
        ],
        directives: {
          ass: true,
          sloppy: true,
          todo: true,
          indent: 4,
          browser: true,
          unparam: true,
          predef: [
            'describe',
            'valid'
            ]
        }
      }
    },
    watch : {
      scripts : {
        files: ['valid.js'],
        tasks : 'jslint'
      }
    },
  });
};