var editorView = EditorView.instance();

// That's very strange but `nw.gui` doesn't live in node require scope.
// Its reference is hardcoded in the require reference in window.
// Just hit `window.require` in devtools to understand.
var gui = require('nw.gui');
var Menu = gui.Menu;
var MenuItem = gui.MenuItem;

var singleton;

// Create a native Mac OS X menu
var NativeMenu = Base.extend({

    // Transform the default menubar in a native Mac OS X menubar.
    create: function () {
        this.menubar = new Menu({type:'menubar'});
        this.menubar.createMacBuiltin('Aviary Photo Editor',{hideEdit: !DEV});
        gui.Window.get().menu = this.menubar;

        // Editor menu
        var editorSubMenu = new Menu();
        editorSubMenu.append(new MenuItem({
            type: 'checkbox',
            label: 'Contain photo',
            checked: false,
            click: function () {
                editorView.toggleContainPhoto();
            }
        }));
        editorSubMenu.append(new MenuItem({
            type: 'checkbox',
            label: 'Real size',
            checked: false,
            enabled: false,
            click: function () {
                console.warn('Not implemented yet');
            }
        }));

        // File menu
        var fileSubMenu = new Menu();
        fileSubMenu.append(new MenuItem({
            label: 'Import...',
            click: function () {
                console.debug('Not implemented yet !');
            }
        }));
        fileSubMenu.append(new MenuItem({
            label: 'Export...',
            click: function () {
                console.debug('Not implemented yet !');
            }
        }));

        // Add menus in the menubar
        this.menubar.insert(new MenuItem({label: 'File', submenu: fileSubMenu}), 1);
        this.menubar.insert(new MenuItem({label: 'Editor', submenu: editorSubMenu}), 2);
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