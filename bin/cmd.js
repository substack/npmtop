#!/usr/bin/env node
var sprintf = require('sprintf').sprintf;
var argv = require('optimist').argv;
var npmtop = require('../');
 
var arg = argv._[0];
var who = argv.who;
var limit = argv.limit;
var start = argv.start || 0;

if (/^\d+-\d+/.test(arg)) {
    var xs = arg.split('-');
    start = parseInt(xs[0], 10);
    limit = parseInt(xs[0], 10) - start;
}
else if (typeof arg === 'string') {
    who = arg;
}
else if (typeof arg === 'number') {
    limit = arg;
}
if (limit === undefined) limit = 15;

npmtop(function (err, all) {
    if (err) return console.error(err);
    console.log('rank   percent   packages   author');
    console.log('----   -------   --------   ------');
    
    var rows;
    if (who) {
        rows = all.filter(function (row) {
            return row.author === who;
        });
    }
    else {
        rows = all.slice(start, start + limit);
    }
    
    rows.forEach(function (row, ix) {
        var rank = start + ix + 1;
        console.log(sprintf(
            '%4d    %.2f %%     %4d     %s',
            row.rank, row.percent, row.packages, row.author
        ));
    });
});
