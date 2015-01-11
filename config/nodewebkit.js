module.exports = {
    nodewebkit: {
        options: {
            platforms: ['osx64'],
            macPlist: 'Info.plist',
            macIcns: 'nw.icns'
        },
        // Files bundled in the app
        src: [
            'package.json',
            'Readme.md',
            'src/**',
            'node_modules/**',
            '!node_modules/*{grunt,jshint}*/**'
        ]
    }
};