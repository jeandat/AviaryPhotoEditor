console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');

// Global shorcuts to avoid accessing window every time
global.win = window;
global.doc = win.doc;
global.$ = window.$;
global.JST = win.JST;
global.Backbone = window.Backbone;
global.$body = $('body');
global._ = win._;

// Global shorcut to bypass a node limitation : all require paths are relative which is ugly and catastrophic when refactoring.
// This shorcut allows us to always use absolute paths.
// Just use `get` instead of `require`.
global.get = function(name) {
    return require(__dirname + '/' + name);
};

// Dependencies
var Aviary = win.Aviary;
var editorView = get('editor/EditorView').instance();
var menuView = get('menu/MenuView').instance();
var DragNDropService = get('common/service/DragNDropService');


// That's very strange but `nw.gui` doesn't live in node require scope.
// Its reference is hardcoded in the require reference in window.
// Just hit `window.require` in devtools to understand.
var gui = win.require('nw.gui');
// Create a native Mac OS X menu
var mb = new gui.Menu({type:'menubar'});
mb.createMacBuiltin('Aviary Photo Editor');
gui.Window.get().menu = mb;


// Render the main menu
$body.append(menuView.render().el);


// Render the editor
$body.append(editorView.render().el);


// Start the drang and drop service
DragNDropService.instance().listen();