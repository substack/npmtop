var top = require('./top');

var http = require('http');

var topResults = 'generating results...refresh...'

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(topResults);
  res.end();
}).listen(8000);
console.log('> http server has started on port 8000');

//
// Crunch the results once to start
//

top.crunch(function(results){
  topResults = results;
});

//
// Now recrunch thr results every 60 minutes
//
/*
setInterval(60000, function(){
  top.crunch(function(results){
    topResults = results;
  });
});
*/

