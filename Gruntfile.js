var path = require("path");

module.exports = function (grunt) {
    /*global module:false*/
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-jslint");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // -------------------------------------------------------------------
        // SIMPLEMOCHA
        // -------------------------------------------------------------------
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/spec.js']
            }
        },
        // -------------------------------------------------------------------
        // JSLINT
        // -------------------------------------------------------------------
        jslint: {
            all: {
                src: [
                    "./lib/swk-compare.js",
                    "./test/spec.js",
                    "./Gruntfile.js"
                ],
                directives: {
                    ass: true,
                    sloppy: true,
                    todo: true,
                    indent: 4,
                    browser: true,
                    unparam: true,
                    nomen: true,
                    predef: [
                        "module",
                        "_",
                        "__dirname",
                        "describe",
                        "expect",
                        "require",
                        "console",
                        "exports",
                        "compare",
                        "it"
                    ]
                }
            }
        },
    // -------------------------------------------------------------------
    // BROWSER TESTS
    // -------------------------------------------------------------------
        watch : {
            js : {
                files: [
                    "./lib/swk-compare.js",
                    "./test/spec.js",
                    "./Gruntfile.js"
                ],
                tasks : [
                    "jslint",
                    "mochaTest"
                ]
            },
            options: {
                atBegin: true,
                reload: true
            }
        }
    });

    grunt.registerTask("test", ["mochaTest"]);
    grunt.registerTask("default", ["watch"]);
};