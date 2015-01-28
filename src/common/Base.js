function Base() {
    this.initialize.apply(this, arguments);
}

// Add Backbone events capabilities to every class
_.extend(Base.prototype, Backbone.Events, {
    // Initialize method to mimic Backbone
    initialize: function initialize() {}
});

// Use backbone inheritance system
Base.extend = Backbone.View.extend;

module.exports = Base;
