var ImportView = get('import/ImportView');
var Base = get('common/Base');

var nativeOnDragOver, nativeOnDrop, singleton;

// Service that defines what happens when dragging a file over the window.
var DragNDropService = Base.extend({
    // Constructor
    initialize: function () {
        _.bindAll(this, 'onDrop', 'onDragOver');
    },
    // Dragging a file over the window will trigger an import view which will import the file in the app.
    listen: function () {
        nativeOnDragOver = win.ondragover;
        nativeOnDrop = win.ondrop;

        win.ondragover = this.onDragOver;
        win.ondrop = this.onDrop;
    },
    // Restore the native behavior
    stopListening: function () {
        win.ondragover = nativeOnDragOver;
        win.ondrop = nativeOnDrop;
    },
    // When the user release the drag in the window, we can analyse what was dragged and eventually render the import view to treat it.
    onDrop: function (event) {
        event.preventDefault();
        console.debug('dataTransfer: %o', event.dataTransfer);
        var files = event.dataTransfer.files;
        if(files && files.length){
            var file = files[0].path;
            console.info('Importing file: ', file);
            var view = new ImportView({file:file});
            $body.append(view.render().el);
            // TODO  remove the window when hidden
        }
    },
    // No op on drag over
    onDragOver: function (event) {
        event.preventDefault();
    }
},{
    instance: function () {
        if (!singleton) {
            singleton = new DragNDropService();
        }
        return singleton;
    }
});

module.exports = DragNDropService;