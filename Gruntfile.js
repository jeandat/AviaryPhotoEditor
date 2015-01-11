
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');

    //loads the various task configuration files
    var configs = require('load-grunt-configs')(grunt);
    grunt.initConfig(configs);

    grunt.registerTask('default', ['jshint']);

};