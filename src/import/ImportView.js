var template = JST['import/import'];
var photoCollection = get('common/PhotoCollection').instance();
var PhotoModel = get('common/PhotoModel');
var fileService = get('common/service/FileService').instance();
var Utils = get('common/utils/Utils');
var WavePopin = get('common/view/popin/wave/WavePopin');

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
        return fileService.importUrl(this.options.url, this.photoModel.id).then(this.registerPhoto);
    },

    importFile: function () {
        return fileService.importFile(this.options.file, this.photoModel.id).then(this.registerPhoto);
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
    }
});

module.exports = ImportView;