module.exports = {
    app:{
        files:[{
            src:'img/**/*.{png,jpg,webp,svg,gif}',
            dest:'<%=build%>/',
            expand:true,
            cwd:'resources'
        },{
            src:['package.json', 'README.md'],
            dest:'<%=build%>/'
        },{
            src:'<%=jsFiles.vendors%>',
            dest:'<%=build%>/'
        },{
            src:'*',
            dest:'<%=build%>/font/icomoon/',
            expand:true,
            cwd:'resources/font/icomoon/fonts/'
        }]
    }
};