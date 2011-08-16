var http = require('http')

var req = {
    host : 'search.npmjs.org',
    'path' : '/_view/author?group=true'
};

exports.list = function (cb) {
    http.get(req, function (res) {
        var s = '';
        res.on('data', function (buf) { s += buf.toString() });
        res.on('end', function () {
            cb(JSON.parse(s).rows.reduce(function (acc, row) {
                acc[row.key] = row.value;
                return acc;
            }, {}));
        });
    });
};
