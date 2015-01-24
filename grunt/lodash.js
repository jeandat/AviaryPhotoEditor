module.exports = {
    // Lodash lib with only backbone required functions + the ones I need
    build:{
        options:{
            modifier:'backbone',
            flags:['--debug']
        },
        dest:'vendors/LoDash/lodash.backbone.js'
    }
};