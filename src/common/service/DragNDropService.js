
var nativeOnDragOver, nativeOnDrop, singleton;

// Service that defines what happens when dragging a file over the window.
var DragNDropService = Base.extend({

    URI_TYPE: 'text/uri-list',

    // Constructor
    initialize: function () {
        _.bindAll(this, 'onDrop', 'onDragOver');
    },

    // Dragging a file over the window will trigger an import view which will import the file in the app.
    listen: function () {
        nativeOnDragOver = window.ondragover;
        nativeOnDrop = window.ondrop;

        window.ondragover = this.onDragOver;
        window.ondrop = this.onDrop;
    },

    // Restore the native behavior
    stopListening: function () {
        window.ondragover = nativeOnDragOver;
        window.ondrop = nativeOnDrop;
    },

    // When the user release the drag in the window, we can analyse what was dragged and eventually render the import view to treat it.
    // We accepts only two types of items : url (text/uri-list) and files
    onDrop: function (event) {

        // We don't want the navigator to replace the content of the page with the dragged content
        event.preventDefault();

        _.forEach(event.dataTransfer.types, function (type) {
            console.debug('%s: %o', type, event.dataTransfer.getData(type));
        });

        // Process urls
        if(_.contains(event.dataTransfer.types, this.URI_TYPE)){
            this.processUrl(event.dataTransfer.getData(this.URI_TYPE));
        }

        // Treating only the first file if there is several
        var files = event.dataTransfer.files;
        if(files && files.length){
            this.processFile(files[0].path);
        }
    },

    processUrl: function (url) {
        console.info('Importing url: %s', url);
        this._process({url:url});
    },

    processFile: function (file) {
        console.info('Importing file: ', file);
        this._process({file:file});
    },

    _process: function (options) {
        var view = new ImportView(options);
        $body.append(view.render().el);
        view.show().done(function () {
            view.startImport();
        });
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