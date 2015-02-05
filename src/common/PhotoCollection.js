var PhotoCollection = Backbone.Collection.extend({

    // Remove the photo from collection and also from disk.
    remove: function () {
        Backbone.Collection.prototype.remove.apply(this, arguments);
        // TODO remove from disk
    }
});

module.exports = PhotoCollection;