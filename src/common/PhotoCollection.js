var singleton;
var fileService = FileService.instance();

var PhotoCollection = Backbone.Collection.extend({

    model: PhotoModel,

    // This is the path to the json file that store the current list of photos.
    COLLECTION_PATH: fileService.HISTORIC + 'collection.json',


    // Sort the collection when a new PhotoModel is added by comparing the modification attribute.
    // According to natural order of date, meaning, most ancien first, most recent last.
    comparator: 'modification',

    initialize: function () {
        // Sort the collection manually when the modification attribute is updated.
        // On add the collection is sorted automatically.
        this.on('change:modification', this.sort);
        this.on('change add remove', this.persist);
    },

    // Load collection from disk (json file).
    // Return a Q promise not a jQuery one.
    fetch: function () {
        var self = this;
        return fileService.readJSON(this.COLLECTION_PATH)
            .then(function (items) {
                // #set is synchronous so it works but if the content of this function was asynchronous, it would be necessary to create a
                // wrapper deferred.
                console.info('Loaded an existing photo collection: %o', items);
                self.set(items, {silent:true});
            })
            .fail(function () {
                console.info('No existing photo collection, starting fresh');
            });
    },

    // Override the push method by allowing 10 items only.
    // The eleventh will replace the oldest one.
    push: function () {
        if(this.size() >= 10) {
            this.remove(this.first(), {silent:true});
        }
        Backbone.Collection.prototype.push.apply(this, arguments);
    },

    persist: function () {
        return fileService.writeJSON(this.COLLECTION_PATH, this.toJSON());
    },

    // Remove one or several models from collection and also from disk.
    remove: function (model) {
        Backbone.Collection.prototype.remove.apply(this, arguments);
        _.isArray(model) ? _.forEach(model, model.destroy) : model.destroy();
    }

}, {
    instance: function () {
        if (!singleton) {
            singleton = new PhotoCollection();
        }
        return singleton;
    }
});

module.exports = PhotoCollection;