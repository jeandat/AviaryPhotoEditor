module.exports = {
    options:{
        paths: ['src/common/styles'],
        banner: '/* John Grey on <%= grunt.template.today() %> */'
    },
    all:{
        files:{
            'app/app.css': 'src/**/*.styl'
        }
    }
};