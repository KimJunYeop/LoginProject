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
    console.log(typeof(result));
    console.log(result);
    res.render('write', {
      data: result
    });
  })
  // res.render('write', {data: data});
});

router.post('/write', function(req, res, next) {
  console.log('post request!');
  var response = {
    status: 200,
    success: false
  }
  var data = req.body;
  var data_info = {
    "title" : data.title,
    "author": data.author,
    "country": data.country,
    "description": data.description
  };
  client.hget('data',data.title,function(err,result) {
    if(result == null) {
      console.log('data가 없습니다. 등록가능!');
      client.hmset('data', data.title, JSON.stringify(data_info), function(err, result) {
        if (err) {
          res.send(JSON.stringify(response));
        }
        response.success = true;
        response.data = data_info;
        res.send(JSON.stringify(response));
      });
    } else {
      console.log('data가 이미 존재합니다.');
      res.send(JSON.stringify(response));
    }
  });
});

router.post('/write/desc',function(req,res,next){
  console.log('/write/desc post !!');
  var title_data = Object.keys(req.body)[0];
  var response = {
    status : 200,
    success : false
  }
  client.hget('data',title_data,function(err,result){
    console.log('reids data ##');
    var json_result = JSON.parse(result);
    if(err) {
      res.send(JSON.stringify(response));
    }

    response.success = true;
    response.description = json_result.description;

    res.send(JSON.stringify(response));
  })
});

module.exports = router;
