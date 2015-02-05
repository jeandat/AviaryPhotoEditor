var Base = get('common/Base');
var fs = require('fs');
var Q = require('Q');
var request = require('request');
var progress = require('progress-stream');

var HOME = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
var APP_SUPPORT = HOME + '/Library/Application Support/AviaryPhotoEditor/';

var singleton;

var FileService = Base.extend({

    // Download a photo on disk into Application Support from a `url`.
    // `id` is used as a name on disk.
    importUrl: function (url, id) {

        console.info('Initiating download of %s', url);

        // TODO create historic folder if non existing
        // TODO which extension ? jpg ?
        var path = APP_SUPPORT + 'historic/' + id + '.jpg';

        var def = Q.defer();

        var progressStream = progress({time: 100})
            .on('progress', function (state) {
                notifyProgress(def, state);
            });

        request(url)
            .on('error', function (err) {
                streamDidNotOpen(def, url, err);
                return def.promise;
            })
            .pipe(progressStream)
            .pipe(fs.createWriteStream(path))
            .on('close', function (err) {
                photoDidSave(def, url, path, err);
            });

        return def.promise;
    },

    // Copy a `file` into Application Support with a generated name.
    // `id` is used as a name on disk.
    importFile: function (file, id) {

        console.info('Initiating download of %s', file);

        // TODO create historic folder if non existing
        // TODO which extension ? jpg ?
        var path = APP_SUPPORT + 'historic/' + id + '.jpg';

        var def = Q.defer();

        // TODO test with an invalid path
        fs.stat(file, function (err, stats) {

            if(err){
                streamDidNotOpen(def, file, err);
                return def.promise;
            }

            var progressStream = progress({length: stats.size, time: 30})
                .on('progress', function (state) {
                    notifyProgress(def, state);
                });

            fs.createReadStream(file)
                .on('error', function (err) {
                    streamDidNotOpen(def, file, err);
                    return def.promise;
                })
                .pipe(progressStream)
                .pipe(fs.createWriteStream(path))
                .on('close', function (err) {
                    photoDidSave(def, file, path, err);
                });

        });

        return def.promise;
    }

}, {
    instance: function () {
        if (!singleton) {
            singleton = new FileService();
        }
        return singleton;
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

function photoDidSave(def, uri, filepath, err){
    if(err) {
        def.reject(err);
        console.error('Failed to save photo on disk at %s: %o', filepath, err);
    } else {
        def.resolve(filepath);
        console.info('Photo at %s saved on disk at %s', uri, filepath);
    }
}

function streamDidNotOpen(def, uri, err){
    def.reject(err);
    console.error('Failed to open stream from %s: %o', uri, err);
}

module.exports = FileService;