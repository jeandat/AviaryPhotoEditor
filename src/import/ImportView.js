var template = JST['import/import'];
var photoCollection = PhotoCollection.instance();
var fileService = FileService.instance();

var ImportView = WavePopin.extend({

    id:'import-view',
    className:WavePopin.prototype.className + ' import-view',

    initialize: function (options) {

        _.bindAll(this, 'registerPhoto');

        options = options || {};
        // This view will be used as content: it contains a list of funds
        options.contentTemplate = template(options);

        WavePopin.prototype.initialize.apply(this, arguments);

        var now = new Date();

        this.photoModel = new PhotoModel({
            id: Utils.guid(),
            importedUri: this.options.url || this.options.file,
            creation: now,
            modification: now
        });

        // This popin removes itself from the DOM when hidden
        this.once('hide', function () {
            this.remove();
        });
    },

    importUrl: function () {
        this._monitorImport(fileService.importUrl(this.options.url, this.photoModel.id));
    },

    importFile: function () {
        this._monitorImport(fileService.importFile(this.options.file, this.photoModel.id));
    },

    // Monitor the progress of the importation and take action when done.
    _monitorImport: function (def) {
        var self = this;
        def.progress(function (state) {
            self.$('progress').attr('value', state.percentage);
        }).then(this.registerPhoto);
    },

    startImport: function () {
        if(this.options.url){
            this.importUrl();
        }
        else if(this.options.file){
            this.importFile();
        }
        else {
            throw new Error(1, 'You can only import a url or a file');
        }
    },

    registerPhoto: function (pathOnDisk) {
        this.photoModel.set('uri', pathOnDisk);
        photoCollection.push(this.photoModel);
        //this.trigger('import', this.photoModel);
        //Backbone.trigger('import', this, this.photoModel);
        //this.hide();
    }
});

module.exports = ImportView;