var files = [{
    src: ['src/**/*.js']
}];

module.exports = {

    options: {

        reporter: require('jshint-stylish'),

        // Enforcing
        quotmark      : 'single', // Quotation mark consistency:
        maxdepth      : 5,        // {int} Max depth of nested blocks (within functions)
        maxcomplexity : 12,       // {int} Max cyclomatic complexity per function
        maxlen        : 160,      // {int} Max number of characters per line
        indent        : 4,
        newcap        : true,    // true: Require capitalization of all constructor functions e.g. `new F()`

        // Relaxing
        eqnull        : true,     // true: Tolerate use of `== null`
        asi           : false,    // Ask for semicolons
        debug         : false,    // true: Allow debugger statements e.g. browser breakpoints.
        evil          : false,    // eval not allowed
        proto         : false,    // __proto__ forbidden
        scripturl     : false,    // urls like javascript:... forbidden
        laxbreak      : false,
        moz           : false,
        noyield       : false,
        strict        : false,     // true: Requires all functions run in ES5 Strict Mode
        loopfunc      : false,
        expr          : false,
        es5           : false,     // true: Allow ES5 syntax (ex: getters and setters)

        // Environments
        browser       : true,     // Web Browser (window, document, etc)
        devel         : false,     // Development/debugging (alert, confirm, etc)
        jquery        : true,
        mocha         : true,
        node          : true,
        mootools      : false,
        couch         : false,
        jasmine       : false,
        qunit         : false,
        rhino         : false,
        shelljs       : false,
        prototypejs   : false,
        yui           : false,
        wsh           : false,
        worker        : false,
        nonstandard   : false,
        browserify    : false,
        devel         : false,
        dojo          : false,

        // Custom Globals
        globals : {}
    },
    dev:{
        options:{
            debug     : true,     // true: Allow debugger statements e.g. browser breakpoints.
            devel     : true      // Development/debugging (alert, confirm, etc)
        },
        files:files
    },
    dist:{
        files:files
    }
};