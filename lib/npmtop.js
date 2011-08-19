var npm = require('npm');
var Hash = require('hashish');
var sprintf = require('sprintf').sprintf;
var argv = require('optimist').argv;
var npmjs = require('./npmjs');
 

//
//  Main method for crunching npmtop values, will take a long time to run
//
exports.crunch = function(callback){
  
  npm.load({ outfd : null }, function () {
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

              callback(render(authors, total));
          }
          else {
              npmjs.list(function (authors) {
                  callback(render(authors, total));
              });
          }

      });
  });  
  
}
 

function render (authors, total) {
  
    var str = '';
    
    str += ('Generated: ' + new Date() + ' \n\n');
    str += ('rank   percent   packages   author \n');
    str += ('----   -------   --------   ------ \n');
    
    var sorted = Object.keys(authors)
        .sort(function (a,b) {
            return (authors[b] - authors[a])
                || (a.toLowerCase() < b.toLowerCase() ? -1 : 1)
            ;
        })
    ;
    
    var limit = argv._[0] || 100;
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
            str += sprintf(
                '%4d    %.2f %%   %4d.%02f    %s',
               rank + start + 1 , percent,
               c, Math.floor((c - Math.floor(c)) * 100),
               name
            ) + '\n';

           lastVal = authors[name];
           fairRank = rank;
        })
    ;
    
    str += ('\n Generated using: http://github.com/substack/npmtop\n\n');
    
    
    return str;
}
