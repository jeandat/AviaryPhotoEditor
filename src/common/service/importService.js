var currentView;
var $chooser = $('#open-dialog');

// Service that defines what happens when dragging a file over the window.
var ImportService = Base.extend({

    initialize: function () {
        Base.prototype.initialize.apply(this, arguments);
        _.bindAll(this, 'didChooseAFile');
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
        if(currentView){
            currentView.hide().then(function () {
                currentView.remove();
                currentView = null;
                createViewFn(options);
            });
        }
        else{
            createViewFn(options);
        }
    },

    // Open a native dialog that allows selecting a file or a photo from iPhoto.
    showOpenDialog: function () {
        $chooser.change(this.didChooseAFile);
        $chooser.trigger('click');
    },

    // Callback that process the file selected in `#showOpenDialog`.
    didChooseAFile: function () {
        var path = $chooser.val();
        if(path){
            // Forced to wait the native dialog is hidden. Too bad.
            _.delay(this.processFile.bind(this), 500, path);
            // Reset the selected value to empty ('') to avoid losing events
            // if the value doesn't change between two dialogs.
            $chooser.val('');
        }
    }

});

function createViewFn(options) {
    currentView = new ImportView(options);
    $body.append(currentView.render().el);
    currentView.show().then(function () {
        currentView.import();
    });
}

module.exports = new ImportService();