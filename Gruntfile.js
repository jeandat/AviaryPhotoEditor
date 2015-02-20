
module.exports = function(grunt) {

    // Loads the various task configuration files
    var configs = require('load-grunt-config')(grunt, {
        data:{
            build:'build',
            jsFiles:{
                vendors:[
                    'vendors/jQuery/*.js',
                    'vendors/LoDash/*.js',
                    'vendors/Aviary/editor.js',
                    'vendors/**/*.js',
                    '!vendors/Aviary/featherpaint.js'
                ]
            }
        }
    });
    grunt.initConfig(configs);
};