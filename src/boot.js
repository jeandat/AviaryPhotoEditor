console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');

var gui = window.require('nw.gui');

var mb = new gui.Menu({type:'menubar'});
mb.createMacBuiltin('Aviary Photo Editor');
gui.Window.get().menu = mb;
