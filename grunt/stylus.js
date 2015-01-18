var files = {
    '<%=build%>/app.css': 'src/**/*.styl'
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