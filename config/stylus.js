module.exports = {
    options:{
        paths: ['src/common/styles'],
        banner: '/* John Grey on <%= grunt.template.today() %> */'
    },
    all:{
        files:{
            'build/app.css': 'src/**/*.styl'
        }
    }
};