var fs = require('fs');
var request = require('request');
var progress = require('progress-stream');
var mkdirp = require('mkdirp');
var promisePipe = require('promisepipe');



// This is the path to the system HOME folder.
var HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
// This is the path to the user Application Support folder (not the system one).
var APP_SUPPORT = HOME + '/Library/Application Support/AviaryPhotoEditor/';
// This is the path to the historic folder inside Application Support in which we will store photos and metadata.
var HISTORIC = APP_SUPPORT + 'historic/';



var FileService = Base.extend({

    HOME: HOME,
    APP_SUPPORT: APP_SUPPORT,
    HISTORIC: HISTORIC,


    initialize: function () {
        // Create the historic folder in Application Support if it doesn't exist
        mkdirp.sync(HISTORIC, {mode: '0700'});
    },

    // Download a photo on disk into Application Support from a `url`.
    // `id` is used as a name on disk.
    importUrl: function (src, id) {
        var def = Q.defer();
        var dest = HISTORIC + id;
        var progressStream = progress({time: 100}).on('progress', function (state) {
            notifyProgress(def, state);
        });
        var readableStream = request(src);
        var writableStream = fs.createWriteStream(dest);
        promisePipe(readableStream, progressStream, writableStream)
        .then(function () {
            console.info('Imported photo from %s to %s', src, dest);
            def.resolve(dest);
        }).catch(function (err) {
            console.error('Failed to import photo from %s: %o', src, err);
            self.removeFile(dest);
            def.reject(err);
        });
        return def.promise;
    },

    // Copy a `file` into Application Support with a generated name.
    // `id` is used as a name on disk.
    importFile: function (src, id) {
        var def = Q.defer();
        var dest = HISTORIC + id;
        var self = this;
        var stat = Q.nbind(fs.stat, fs);
        stat(src).catch(function(err){
            console.error('File at %s is not accessible: %o', src, err);
            def.reject(err);
        }).then(function(stats){
            var progressStream = progress({length: stats.size, time: 30}).on('progress', function (state) {
                notifyProgress(def, state);
            });
            var readableStream = fs.createReadStream(src);
            var writableStream = fs.createWriteStream(dest);
            return promisePipe(readableStream, progressStream, writableStream);
        }).then(function () {
            console.info('Imported photo from %s to %s', src, dest);
            def.resolve(dest);
        }).catch(function (err) {
            console.error('Failed to import photo from %s: %o', src, err);
            self.removeFile(dest);
            def.reject(err);
        });
        return def.promise;
    },

    // Read the content of a file and invoke `callback` `(err, content)` on success or error.
    readJSON: function (filePath, options) {
        var def = Q.defer();
        var readFile = Q.nbind(fs.readFile, fs);
        readFile(filePath, options)
            .then(function(data){
                try {
                    def.resolve(JSON.parse(data));
                    console.info('Read file %s', filePath);
                }
                catch (err) {
                    console.error('Failed to read file %s', filePath);
                    def.reject(err);
                }
            })
            .fail(function (err) {
                console.error('Failed to read file %s', filePath);
                def.reject(err);
            });
        return def.promise;
    },

    // Write a JSON representation of an object into a file on disk.
    // `callback (err)` is invoked on success or error.
    writeJSON: function(filePath, obj, options) {
        var def = Q.defer();
        try {
            var str = JSON.stringify(obj, null, '    ');
            fs.writeFile(filePath, str, options, def.makeNodeResolver());
            console.info('Written file %s', filePath);
        }
        catch (err) {
            console.error('Failed to write file %s', filePath);
            def.reject(err);
        }
        return def.promise;
    },

    // Remove a file on disk from a a `path`.
    removeFile: function (path){
        fs.unlink(path, function (err) {
            err && console.error('Can\'t remove file at %s: ', path, err);
        });
    },

    copy: function (src, dest) {
        return promisePipe(
            fs.createReadStream(src),
            fs.createWriteStream(dest)
        ).then(function(){
            console.debug('File at %s saved on disk at %s', src, dest);
        }).catch(function(err) {
            console.error('Failed to copy file from %s to %s: %o', src, dest, err.originalError);
        });
    }

});

// Notify listeners with a state object with the following structure:
//```
//{
//  percentage: 86,
//  transferred: 949624,
//  length: 10485760,
//  remaining: 9536136,
//  eta: 42,
//  runtime: 3,
//  delta: 295396,
//  speed: 949624
//}
//```
//
function notifyProgress(def, state){
    state.percentage = Math.floor(state.percentage);
    console.debug('Received %s of %s: ', state.transferred, state.length);
    console.debug('Percent: ', state.percentage);
    def.notify(state);
}

module.exports = new FileService();