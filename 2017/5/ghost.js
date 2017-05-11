var fs = require('fs'),
    request = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const GHOST_ENDPOINT = {
    protocol: 'https:',
    host: '52.49.91.111',
    port: 8443,
    path: '/ghost'
};
const GHOST_URL = GHOST_ENDPOINT.protocol + '//' + GHOST_ENDPOINT.host + ':' +
    GHOST_ENDPOINT.port + GHOST_ENDPOINT.path;

var base64Image = '';
var bytesRead = 0;

var getImage = function(callback) {
    var options = {
        url: GHOST_URL,
        headers: {
            'Range': `bytes=${bytesRead}-${bytesRead + 12}`
        }
    }
    request.get(options, function(err, res, body){
        if (err) {
          throw err;
        }

        base64Image += body;
//        bytesRead += parseInt(res.headers['content-length']); // Can be wrong data
        bytesRead += body.length;

        if (res.statusCode === 206) {
            getImage(callback);
        } else {
            callback();
        }
  });
};

getImage(function() {
    var buffer = Buffer.from(base64Image, 'base64');
    var wstream = fs.createWriteStream('ghost.png');
    wstream.write(buffer);
    wstream.end();

    console.log('done with ' + bytesRead + ' bytes read');
});

// After watching the image, with code 4017-8120, we request that Range, with HTTP/2.0

var options = {
    protocol: GHOST_ENDPOINT.protocol,
    host: GHOST_ENDPOINT.host,
    port: GHOST_ENDPOINT.port,
    path: GHOST_ENDPOINT.path,
    headers: {
        'Range': `bytes=4017-8120`
    }
}
var request2 = require('http2').get(options);

// Ignore the response
request2.on('response', function(response) {
    // Ignore
    //response.pipe(process.stdout);
});

// Receive push streams
request2.on('push', function(pushRequest) {
    pushRequest.on('response', function(pushResponse) {
        pushResponse.pipe(process.stdout);
        pushResponse.on('finish', process.exit);
    });
});
