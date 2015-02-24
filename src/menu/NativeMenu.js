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

    // Create a native menu's content.
    create: function () {

        this.menubar = new Menu({type:'menubar'});
        this.menubar.createMacBuiltin('Aviary Photo Editor',{hideEdit: !DEV});
        gui.Window.get().menu = this.menubar;

        // Editor menu
        var editorSubMenu = new Menu();

        // Size sub menu
        var sizeSubMenu = new Menu();
        append(sizeSubMenu, new MenuItem({
            type: 'checkbox',
            label: 'Cover',
            checked: true,
            click: function () {
                editorView.sizeBehavior('cover');
            }
        }));
        append(sizeSubMenu, new MenuItem({
            type: 'checkbox',
            label: 'Contain',
            checked: false,
            click: function () {
                editorView.sizeBehavior('contain');
            }
        }));
        editorSubMenu.append(new MenuItem({label: 'Size', submenu: sizeSubMenu}));


        // Transition sub menu
        var transitionSubMenu = new Menu();
        append(transitionSubMenu, new MenuItem({
            type: 'checkbox',
            label: 'Fade',
            checked: true,
            click: function () {
                editorView.transitionBehavior('fade');
            }
        }));
        append(transitionSubMenu, new MenuItem({
            type: 'checkbox',
            label: 'Luminance',
            checked: false,
            click: function () {
                editorView.transitionBehavior('luminance');
            }
        }));
        editorSubMenu.append(new MenuItem({label: 'Transition', submenu: transitionSubMenu}));


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

// Make sure when appending items to a menu that there is max one checked element.
// The idea is to simulate the behavior of a radio button with menu items, a sort of radio menu.
function append(menu, item){
    if(item.checked && menu.selectedItem == null){
        menu.selectedItem = item;
    }
    else if(item.checked && menu.selectedItem.id !== item.id){
        menu.selectedItem.checked = false;
        menu.selectedItem = item;
    }
    var clickFn = item.click;
    item.click = function(){
        itemDidClicked(menu, item, clickFn);
    };
    menu.append(item);
}

function itemDidClicked(menu, item, clickFn){
    // If there was no preselected item during the appending phase, just make the clicked one selected.
    if(menu.selectedItem == null){
        menu.selectedItem = item;
        clickFn();
        return;
    }

    // If the clicked item is already selected, noop, it is not possible to unselect an item.
    if(menu.selectedItem.id === item.id){
        console.debug('Can\'t unselect a radio menu item');
        // Restore the previous state as nw will change the checked state.
        menu.selectedItem.checked = true;
        return;
    }

    // If an unselected item is clicked, make it selected.
    if(menu.selectedItem.id !== item.id){
        console.debug('Menu item \'%s\' selected', item.label);
        menu.selectedItem.checked = false;
        menu.selectedItem = item;
        clickFn();
    }
}

module.exports = NativeMenu;