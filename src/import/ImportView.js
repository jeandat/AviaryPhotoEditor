var template = JST['import/import'];
var errPrefix = 'Houston, we\'ve had a problem here. ';

var ImportView = WavePopin.extend({

    id:'import-view',
    className:WavePopin.prototype.className + ' import-view',

    initialize: function (options) {

        _.bindAll(this, 'registerPhoto', 'abort');

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
        var uri = this.options.url || this.options.file;

        if(!uri){
            throw new CustomError(2, 'You can only import a url or a file');
        }

        var self = this;
        // Check that the given uri is an image before importing anything.
        $('<img>').attr('src',uri).load(function(){
            console.debug('OK, good, this is an image');
            var promise = self.options.url ? self.importUrl() : self.importFile();
            promise.fail(self.abort);
            return promise;
        }).error(function () {
            var err = new CustomError(3, 'This doesn\'t seem to be an image.');
            self.abort(err);
            // For consistency, this method will always return a promise.
            var def = Q.defer();
            def.reject(err);
            return def.promise;
        });
    },

    abort: function (err) {
        console.error('Import failed: %o', err);
        this.$('.progress').addClass('failed');
        var $message = this.$('.message');
        if(err && err.code === 3){
            $message.text(errPrefix + err.message);
        }
        else{
            $message.text(errPrefix + 'Import aborted.');
        }
        $message.removeClass('hidden');
        // TODO Add a cross in the right corner with an svg animation (path containing 5 points)
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