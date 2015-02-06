var singleton;

var PhotoModel = get('common/PhotoModel');

var PhotoCollection = Backbone.Collection.extend({

    model: PhotoModel,

    push: function () {
        Backbone.Collection.prototype.push.apply(this, arguments);
        // TODO limit to 10
    },

    // Remove the photo from collection and also from disk.
    remove: function () {
        Backbone.Collection.prototype.remove.apply(this, arguments);
        // TODO remove from disk
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