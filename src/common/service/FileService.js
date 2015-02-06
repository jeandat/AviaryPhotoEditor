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
        var savePath = APP_SUPPORT + 'historic/' + id;

        var def = Q.defer();

        var progressStream = progress({time: 100}).on('progress', function (state) {
            notifyProgress(def, state);
        });

        var readableStream = request(url);
        var writableStream = fs.createWriteStream(savePath);

        readableStream
            .on('error', function (err) {
                streamDidNotOpen(def, savePath, url, err);
            })
            .pipe(progressStream)
            .pipe(writableStream)
            .on('error', function (err) {
                streamDidNotOpen(def, savePath, savePath, err);
            })
            .on('close', function (err) {
                if(err)
                    photoDidNotSave(def, savePath, err);
                else
                    photoDidSave(def, url, savePath);
            });

        return def.promise;
    },

    // Copy a `file` into Application Support with a generated name.
    // `id` is used as a name on disk.
    importFile: function (fileUri, id) {

        console.info('Initiating download of %s', fileUri);

        // TODO create historic folder if non existing
        var savePath = APP_SUPPORT + 'historic/' + id;

        var def = Q.defer();

        fs.stat(fileUri, function (err, stats) {

            if(err){
                streamDidNotOpen(def, null, fileUri, err);
                return;
            }

            var progressStream = progress({length: stats.size, time: 30}).on('progress', function (state) {
                notifyProgress(def, state);
            });

            var readableStream = fs.createReadStream(fileUri);
            var writableStream = fs.createWriteStream(savePath);

            readableStream
                .on('error', function (err) {
                    streamDidNotOpen(def, savePath, fileUri, err);
                })
                .pipe(progressStream)
                .pipe(writableStream)
                .on('error', function (err) {
                    streamDidNotOpen(def, savePath, savePath, err);
                })
                .on('close', function (err) {
                    if(err)
                        photoDidNotSave(def, savePath, err);
                    else
                        photoDidSave(def, fileUri, savePath);
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

function photoDidNotSave(def, savePath, err){
    console.error('Failed to save photo on disk at %s: %o', savePath, err);
    savePath && removePhotoOnErr(savePath);
    def.reject(err);
}

function photoDidSave(def, openUri, savePath){
    console.info('Photo at %s saved on disk at %s', openUri, savePath);
    def.resolve(savePath);
}

// Could be either the read or write stream.
// savePath and openUri might be the same.
// Whatever scenario, if savePath is provided, it means the write stream was created, so we need to remove it.
function streamDidNotOpen(def, savePath, openUri, err){
    console.error('Failed to open stream from %s: %o', openUri, err);
    savePath && removePhotoOnErr(savePath);
    def.reject(err);
}

function removePhotoOnErr(savePath){
    fs.unlink(savePath, function (err) {
        err && console.error('Can\'t remove photo at %s: ', savePath, err);
    });
}

module.exports = FileService;