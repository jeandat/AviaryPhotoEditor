var files = {
    '<%=build%>/app.css': [
        'src/**/*.styl',
        'resources/font/icomoon/style.css'
    ]
};

module.exports = {
    options:{
        paths: ['src/common/styles'],
        banner: '/* John Grey on <%= grunt.template.today() %> */'
    },
    dev:{
        files:files
    },
    dist:{
        options:{
            compress:true
        },
        files:files
    }
};