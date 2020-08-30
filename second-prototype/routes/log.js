var express = require('express');
var router = express.Router();

/* POST a log message. */
router.post('/', function(req, res, next) {
	var date = new Date();
	var day = date.getDate();
	fs = require('fs');
	var data = JSON.stringify(req.body.msg);
	fs.appendFile('/home/duncan/scorer/second-prototype/logs/log'+day+'.log', data + "\n", 'utf8', function(err) { console.log(err);});
  res.send('ok with a resource');
});

router.get('/', function(req, res, next) {
  res.send('ok with a resource log');
});

module.exports = router;
