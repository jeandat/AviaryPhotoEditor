var files=[{
        src:[
            'src/**/*.jade',
            '!src/index.jade'
        ],
        dest:'app/templates.js'
    },
    {
        src:'src/index.jade',
        dest:'app/index.html'
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