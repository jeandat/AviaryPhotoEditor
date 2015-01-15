var files=[{
        src:[
            'src/**/*.jade',
            '!src/index.jade'
        ],
        dest:'build/templates.js'
    },
    {
        src:'src/index.jade',
        dest:'build/index.html'
    }
];

module.exports={
    dev:{
        options:{
            pretty: true
        },
        files:files
    },
    dist:{
        files:files
    }
};