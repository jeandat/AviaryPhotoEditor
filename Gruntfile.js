
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    //loads the various task configuration files
    var configs = require('load-grunt-configs')(grunt);
    grunt.initConfig(configs);

    grunt.registerTask('default', ['jshint']);

};