module.exports = {
    options: {
        reporter: require('jshint-stylish'),
        quotmark: 'single'
    },
    all: {
        src: [
            '**/*.js',
            '!node_modules/**',
            '!.idea/**'
        ]
    }
};