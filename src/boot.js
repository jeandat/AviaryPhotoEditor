console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');

// Global shorcuts to avoid accessing window every time
global.win = window;
global.doc = win.doc;
global.$ = window.$;
global.Backbone = window.Backbone;

// Global shorcut to bypass a node limitation : all require paths are relative which is ugly and catastrophic when refactoring.
// This shorcut allows us to always use absolute paths.
// Just use `get` instead of `require`.
global.get = function(name) {
    return require(__dirname + '/' + name);
};

var Aviary = win.Aviary;

// That's very strange but `nw.gui` doesn't live in node require scope.
// Its reference is hardcoded in the require reference in window.
// Just hit `window.require` in devtools to understand.
var gui = win.require('nw.gui');


// Create a native Mac OS X menu
var mb = new gui.Menu({type:'menubar'});
mb.createMacBuiltin('Aviary Photo Editor');
gui.Window.get().menu = mb;


// Start the main router
var MainRouter = get('common/router/Main');
MainRouter.instance().start();


// Prepare the Aviary Editor
var featherEditor = new Aviary.Feather({
    apiKey:'3b1eb7150b164beebe6996cea9086c57',
    image:'editor',
    tools:'all',
    displayImageSize:true,
    enableCORS:true,
    onLoad:function(){
        console.debug('Aviary editor loaded');
    },
    onReady:function(){
        console.debug('Aviary editor ready');
    },
    onError:function(err){
        console.error('Failed to instantiate the Aviary editor: ', err);
    }
    //onSave:function(imageID, newURL) {
    //    $(imageID).attr(src,newURL);
    //}
});

featherEditor.launch();