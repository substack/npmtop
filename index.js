var request = require('request');
var uri = 'http://isaacs.couchone.com/registry/_design/app/_view/npmTop?group_level=1';


module.exports = function (cb) {
    getScores(function (err, scores) {
        if (err) return cb(err);
        
        var total = Object.keys(scores).reduce(function (sum, name) {
            return sum + scores[name];
        }, 0);
        
        var sorted = Object.keys(scores)
            .sort(function (a,b) {
                return (scores[b] - scores[a])
                    || (a.toLowerCase() < b.toLowerCase() ? -1 : 1)
                ;
            })
            .map(function (name, ix) {
                return {
                    rank : ix + 1,
                    percent : 100 * scores[name] / total,
                    packages : scores[name],
                    author : name,
                };
            })
        ;
        cb(null, sorted);
    });
};

function getScores (cb) {
    request({ uri : uri}, function (err, res, body) {
        if (err) return cb(err)
        if (body.error) return cb(body.error)
        var row = JSON.parse(body).rows

        var scores = row.reduce(function (acc, row) {
            acc[row.key] = row.value;
            return acc;
        }, {});
        cb(null, scores);
    });
}