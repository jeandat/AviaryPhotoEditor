console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');

// Global shorcuts to avoid accessing window every time
global.win = window;
global.doc = win.doc;
global.$ = win.$;
global.JST = win.JST;
global.Backbone = win.Backbone;
global.$body = $('body');
global._ = win._;

// Global shorcut to bypass a node limitation : all require paths are relative which is ugly and catastrophic when refactoring.
// This shorcut allows us to always use absolute paths.
// Just use `get` instead of `require`.
global.get = function(name) {
    return require(__dirname + '/' + name);
};

// Dependencies
var editorView = get('editor/EditorView').instance();
var menuView = get('menu/MenuView').instance();
var nativeMenu = get('menu/NativeMenu').instance();
var dragNDropService = get('common/service/DragNDropService').instance();
var photoCollection = get('common/PhotoCollection').instance();
var gui = win.require('nw.gui');


// Create a native Mac OS X menu
nativeMenu.create();


// Render the main menu
$body.append(menuView.render().el);


// Render the editor
$body.append(editorView.render().el);


// Start the drang and drop service
dragNDropService.listen();


// Load the previous photo collection historic
// Show the app after everything is ready
// The last .done() instruction is a failsafe in case there was no fail block in the chain. If a rejected promise is not caught,
// or a then block return an error, it will throw an error in the next event loop assuring at least there is an error in the console.
photoCollection.fetch().then(function () {gui.Window.get().show();}).done();


