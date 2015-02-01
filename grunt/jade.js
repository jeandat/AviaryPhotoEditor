
module.exports = function(grunt,options){
    return {
        index:{
            options:{
                data:{
                    vendors:grunt.file.expand(options.jsFiles.vendors)
                }
            },
            src:'src/index.jade',
            dest:'<%=build%>/index.html'
        },
        jst:{
            options:{
                client:true,
                processName: function (filename) {
                    var key = filename.replace('src/','').replace('.jade','');
                    grunt.verbose.writeln('> JST key for filename %s is %s', filename, key);
                    return key;
                }
            },
            src:[
                'src/**/*.jade',
                '!src/index.jade'
            ],
            dest:'<%=build%>/templates.js'
        }
    };
};