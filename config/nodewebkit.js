module.exports = {
    nodewebkit: {
        options: {
            platforms: ['osx64'],
            macPlist: 'resources/Info.plist',
            macIcns: 'resources/app.icns'
        },
        // Files bundled in the app
        src: [
            'package.json',
            'Readme.md',
            'src/**',
            'resources/img/**',
            'node_modules/**',
            '!node_modules/*{grunt,jshint}*/**'
        ]
    }
};