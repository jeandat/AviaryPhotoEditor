console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');

// Global shorcuts to avoid accessing window every time
global.win = window;
global.doc = win.doc;
global.$ = window.$;
global.JST = win.JST;
global.Backbone = window.Backbone;
global.$body = $('body');

// Global shorcut to bypass a node limitation : all require paths are relative which is ugly and catastrophic when refactoring.
// This shorcut allows us to always use absolute paths.
// Just use `get` instead of `require`.
global.get = function(name) {
    return require(__dirname + '/' + name);
};

// Render the editor
var Aviary = win.Aviary;
var EditorView = get('editor/EditorView');
var editorView = new EditorView();
$body.append(editorView.render().$el);


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


// Render the main menu
var MenuView = get('menu/MenuView');
var menuView = new MenuView();
$body.append(menuView.render().el);
