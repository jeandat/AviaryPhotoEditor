module.exports = {
    main:{
        files:[{
            src:'img/**',
            dest:'build/',
            expand:true,
            cwd:'resources'
        },{
            src:['package.json', 'README.md'],
            dest:'build/'
        }]
    }
};