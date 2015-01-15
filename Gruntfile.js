
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    //loads the various task configuration files
    var configs = require('load-grunt-configs')(grunt);
    grunt.initConfig(configs);

    // Default build for dev
    grunt.registerTask('default', ['clean', 'jshint', 'stylus', 'jade:dev', 'uglify:dev', 'copy']);

    // Prepare a binary for distribution
    grunt.registerTask('dist', ['clean', 'jshint', 'stylus', 'jade:dist', 'uglify:dist', 'copy', 'nodewebkit']);

};