module.exports = {
    app:{
        files:[{
            src:'img/**',
            dest:'<%=build%>/',
            expand:true,
            cwd:'resources'
        },{
            src:['package.json', 'README.md'],
            dest:'<%=build%>/'
        },{
            src:'<%=vendors.js%>',
            dest:'<%=build%>/'
        }]
    }
};