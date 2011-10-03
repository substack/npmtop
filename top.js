#!/usr/bin/env node

var npm = require('npm');
var Hash = require('hashish');
var sprintf = require('sprintf').sprintf;
var argv = require('optimist').argv;

var npmjs = require('./npmjs');
 
npm.load({ outfd : null }, function () {
    npm.config.set('outfd', null);
    npm.commands.search([], function (err, pkgs) {
        var authors = {};
        var total = Hash(pkgs).length;
        
        if (argv.maintainers) {
            Hash(pkgs).forEach(function (pkg) {
                var users = pkg.maintainers
                    .map(function (w) { return w.slice(1) })
                ;
                
                users.forEach(function (u) {
                    authors[u] = (authors[u] || 0) + (1 / users.length);
                });
            });
            
            render(authors, total);
        }
        else {
            npmjs.list(function (authors) {
                render(authors, total);
            });
        }
        
    });
});

function render (authors, total) {
    console.log('rank   percent   packages   author');
    console.log('----   -------   --------   ------');
    
    var sorted = Object.keys(authors)
        .sort(function (a,b) {
            return (authors[b] - authors[a])
                || (a.toLowerCase() < b.toLowerCase() ? -1 : 1)
            ;
        })
    ;
    
    var limit = argv._[0] || 15;
    var start = 0;
    
    if (!limit.toString().match(/^\d+$/)) {
        var who = argv._[0];
        start = sorted.indexOf(who);
        limit = 1;
    }
    
    var fairRank = 1;
    var lastVal = -1;
    sorted
        .slice(start, start + limit)
        .forEach(function (name, rank) {
            var percent = (authors[name] / total) * 100;
            
            if(authors[name] == lastVal)
              rank = fairRank;
            
            var c = authors[name];
            console.log(sprintf(
                '%4d    %.2f %%   %4d.%02f    %s',
               rank + start + 1 , percent,
               c, Math.floor((c - Math.floor(c)) * 100),
               name
            ));

           lastVal = authors[name];
           fairRank = rank;
        })
    ;
}
