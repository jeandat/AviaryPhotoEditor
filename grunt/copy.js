module.exports = {
    app:{
        files:[{
            src:'img/**/*.{png,jpg,webp,svg,gif}',
            dest:'<%=build%>/',
            expand:true,
            cwd:'resources'
        },
        {
            src:['package.json', 'README.md'],
            dest:'<%=build%>/'
        },
        {
            src:'<%=jsFiles.vendors%>',
            dest:'<%=build%>/'
        },
        // Fonts
        {
            src:'**/*.{ttf,woff,eot,svg}',
            dest:'<%=build%>/font/',
            expand:true,
            flatten:true,
            cwd:'resources/font/'
        }]
    }
};