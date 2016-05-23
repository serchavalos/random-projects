var http = require('http');

var jobs = '';
var options = {
  host: 'api.arbetsformedlingen.se',
  port: '80',
  path: '/af/v0/platsannonser/soklista/lan',
  headers: {
    'accept': 'application/json',
    'accept-language': 'sv'
  },
  method: 'GET',

};

var afReq = http.request(options, function(res){
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    console.log(chunk);
    jobs += chunk + '';
  });
});

afReq.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

afReq.write('');
afReq.end();

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.set({'content-type': 'application/json' ,'content-lenth': Buffer.byteLength(jobs, 'utf8')})
  res.send(jobs);
});

app.get('/test/', function(req, res){
  res.json(({ user: 'tobi' }));
});

app.listen('8888', function() {
	console.log('Server started!');
});

