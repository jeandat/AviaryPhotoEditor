var files = [{
    src: ['src/**/*.js']
}];

module.exports = {
    options: {
        reporter: require('jshint-stylish'),

        'maxerr'        : 50,       // {int} Maximum error before stopping

        // Enforcing
        'newcap'        : true,     // true: Require capitalization of all constructor functions e.g. `new F()`
        'quotmark'      : 'single', // Quotation mark consistency:
        'maxdepth'      : 5,        // {int} Max depth of nested blocks (within functions)
        'maxcomplexity' : 12,       // {int} Max cyclomatic complexity per function
        'maxlen'        : 160,      // {int} Max number of characters per line

        // Relaxing
        'eqnull'        : true,      // true: Tolerate use of `== null`
        'es5'           : true,      // true: Allow ES5 syntax (ex: getters and setters)
                                     // (ex: `for each`, multiple try/catch, function expression…)
        'globalstrict'  : true,      // true: Allow global 'use strict' (also enables 'strict')

        // Environments
        'browser'       : true,     // Web Browser (window, document, etc)
        'devel'         : false,     // Development/debugging (alert, confirm, etc)
        'jquery'        : true,    // jQuery
        'mocha'         : true,     // Mocha
        'node'          : true,    // Node.js

        // Custom Globals
        'globals'       : {}        // additional predefined global variables
    },
    dev:{
        options:{
            'debug'     : true,     // true: Allow debugger statements e.g. browser breakpoints.
            'devel'     : true     // Development/debugging (alert, confirm, etc)
        },
        files:files
    },
    dist:{
        files:files
    }
};