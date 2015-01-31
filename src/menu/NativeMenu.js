var Base = get('common/Base');
var editorView = get('editor/EditorView').instance();

// That's very strange but `nw.gui` doesn't live in node require scope.
// Its reference is hardcoded in the require reference in window.
// Just hit `window.require` in devtools to understand.
var gui = win.require('nw.gui');
var Menu = gui.Menu;
var MenuItem = gui.MenuItem;

var singleton;

// Create a native Mac OS X menu
var NativeMenu = Base.extend({

    // Transform the default menubar in a native Mac OS X menubar.
    create: function () {
        this.menubar = new Menu({type:'menubar'});
        this.menubar.createMacBuiltin('Aviary Photo Editor',{hideEdit: true});
        gui.Window.get().menu = this.menubar;

        var editorSubMenu = new Menu();
        editorSubMenu.append(new MenuItem({
            type: 'checkbox',
            label: 'Contain photo',
            checked: false,
            click: function () {
                editorView.toggleContainPhoto();
            }
        }));

        var editorMenuItem = new MenuItem({
            label: 'Editor',
            submenu: editorSubMenu
        });

        this.menubar.insert(editorMenuItem,1);
    }


}, {
    instance: function () {
        if (!singleton) {
            singleton = new NativeMenu();
        }
        return singleton;
    }
});

module.exports = NativeMenu;