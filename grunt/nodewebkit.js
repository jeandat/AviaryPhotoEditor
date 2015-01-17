module.exports = {
    options: {
        version: '0.11.5',
        platforms: ['osx64'],
        buildDir: 'dist',
        macPlist: 'resources/Info.plist',
        macIcns: 'resources/app.icns'
    },
    // Files bundled in the app
    src: [
        'package.json',
        'Readme.md',
        'build/**'
    ]
};