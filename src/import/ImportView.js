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
        return this._monitorImport(fileService.importUrl(this.options.url, this.photoModel.id));
    },

    importFile: function () {
        return this._monitorImport(fileService.importFile(this.options.file, this.photoModel.id));
    },

    // Monitor the progress of the importation and take action when done.
    _monitorImport: function (def) {
        var self = this;
        return def.progress(function (state) {
            self.$('progress').attr('value', state.percentage);
        }).then(this.registerPhoto);
    },

    import: function () {
        var promise;
        if(this.options.url){
            promise = this.importUrl();
        }
        else if(this.options.file){
            promise = this.importFile();
        }
        else {
            throw new Error(1, 'You can only import a url or a file');
        }
        promise.fail(function (err) {
            // TODO show error message in place of the progress bar
            console.error('Import failed: %o', err);
            // TODO Add a cross in the right corner ?
        });
    },

    registerPhoto: function (pathOnDisk) {
        this.photoModel.set('uri', pathOnDisk);
        photoCollection.push(this.photoModel);
        var self = this;
        var def = Q.defer();
        setTimeout(function () {
            self.hide().then(function () {
                def.resolve();
                self.trigger('import', self.photoModel);
                Backbone.trigger('import', self, self.photoModel);
            });
        },1000);
        return def.promise;
    }
});

module.exports = ImportView;