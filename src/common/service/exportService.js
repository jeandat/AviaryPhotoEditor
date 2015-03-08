var $chooser = $('#save-dialog');

// Service that defines what happens when dragging a file over the window.
var ExportService = Base.extend({

    initialize: function () {
        Base.prototype.initialize.apply(this, arguments);
        _.bindAll(this, 'didChooseALocation');
        $chooser.change(this.didChooseALocation);
    },

    // Open a native dialog that allows selecting a file or a photo from iPhoto.
    showExportDialog: function () {
        $chooser.trigger('click');
    },

    // Callback that process the file selected in `#showOpenDialog`.
    didChooseALocation: function () {
        var path = $chooser.val();
        if(path){
            console.debug('Export path: ', path);
            editorView.getModel().saveTo(path);
            $chooser.val('');
        }
    }

});

module.exports = new ExportService();