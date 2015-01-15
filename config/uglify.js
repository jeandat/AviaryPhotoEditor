var files = [{
    src: '**/*.js',
    dest: 'app/',
    expand: true,
    cwd:'src'
}];

module.exports = {
    options: {
        mangle: true,
        compress: true,
        beautify: false
    },
    dev: {
        options: {
            mangle: false,
            beautify: true,
            preserveComments: 'all'
        },
        files: files
    },
    dist: {
        files: files
    }

};