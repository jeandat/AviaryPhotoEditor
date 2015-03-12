
module.exports = function(grunt) {

    // Loads the various task configuration files
    var configs = require('load-grunt-config')(grunt, {
        jitGrunt:true,
        data:{
            build:'build',
            jsFiles:{
                vendors:[
                    'vendors/jQuery/*.js',
                    'vendors/LoDash/*.js',
                    'vendors/Aviary/editor.js',
                    'vendors/**/*.js'
                ]
            }
        }
    });
    grunt.initConfig(configs);
};