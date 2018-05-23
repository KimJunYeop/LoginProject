var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/write', function(req, res, next) {
  var data = {};
  client.hgetall('data', function(err, result) {
    if (err) {
      console.log(err)
    }
    console.dir(result);
    res.render('write', {
      data: result
    });
  })

  // res.render('write', {data: data});


});

router.post('/write', function(req, res, next) {
  // res.writeHead(200, {'Content-Type': 'application/json'});
  console.log('post request!');
  console.log(req.body);

  var response = {
    status: 200,
    success: false
  }

  var data = req.body;
  var data_info = {
    "author": data.author,
    "country": data.country,
    "description": data.description
  };

  client.hmset('data', data.title, JSON.stringify(data_info), function(err, result) {
    if (err) {
      console.log('#### error occurs!');
      console.log(err);
      res.send(JSON.stringify(response));
    }
    console.log(result);
    response.success = true;

    res.send(JSON.stringify(response));
  });
});

module.exports = router;
