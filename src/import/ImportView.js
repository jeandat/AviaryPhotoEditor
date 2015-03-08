var template = JST['import/import'];
var errPrefix = 'Houston, we\'ve had a problem here. ';

var ImportView = WavePopin.extend({

    id: 'import-view',

    className: function () {
        return _.result(WavePopin.prototype, 'className') + ' import-view';
    },

    initialize: function (options) {

        _.bindAll(this, 'registerPhoto', 'abort');

        options = options || {};
        // This view will be used as content: it contains a list of funds
        options.contentTemplate = template(options);

        WavePopin.prototype.initialize.call(this, options);

        var now = new Date();

        this.model = new PhotoModel({
            id: Utils.guid(),
            importedUri: this.options.url || this.options.file,
            creation: now,
            modification: now
        });

        // This popin removes itself from the DOM when hidden
        this.once('hide', this.remove);
    },

    importUrl: function () {
        return this._monitorImport(fileService.importUrl(this.options.url, this.model.id));
    },

    importFile: function () {
        return this._monitorImport(fileService.importFile(this.options.file, this.model.id));
    },

    // Monitor the progress of the importation and take action when done.
    _monitorImport: function (def) {
        var self = this;
        var progressValue = self.$('.progress-value')[0];
        var raf = function (state) {
            requestAnimationFrame(function () {
                progressValue.style.transform = 'translateX(-' + (100 - state.percentage) + '%)';
            });
        };
        return def.progress(raf).then(this.registerPhoto);
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
        this.setClosable(true);
    },

    registerPhoto: function (pathOnDisk) {
        this.model.set('uri', pathOnDisk);
        photoCollection.push(this.model);
        var self = this;
        var def = Q.defer();
        setTimeout(function () {
            self.hide().then(function () {
                def.resolve();
                self.trigger('import', self.model);
                Backbone.trigger('import', self, self.model);
            });
        },1000);
        return def.promise;
    }
});

module.exports = ImportView;