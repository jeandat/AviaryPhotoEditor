// jshint camelcase: false

var files = [{
    src:'**/*.js',
    dest:'<%=build%>/',
    expand:true,
    cwd:'src'
}];

module.exports = {
    options:{
        mangle:true,
        compress:true,
        beautify:false,
        report:'false',
        banner:'"use strict";'
    },
    dev:{
        options:{
            mangle:false,
            beautify:{
                beautify:true,
                bracketize:true
            },
            preserveComments:'all',
            compress:{
                drop_debugger:false,
                drop_console:false,
                sequences:false,
                join_vars:false,
                global_defs:{
                    DEV:true
                }
            }
        },
        files:files
    },
    dist:{
        options:{
            compress:{
                global_defs:{
                    DEV:false
                }
            }
        },
        files:files
    }

};