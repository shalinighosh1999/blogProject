var express = require('express');
var router = express.Router();
const cron=require('node-cron')




const multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

////////////////////////////////////////////////// ************************  ADMIN AND USER AUTH   ************************  ////////////////////////////////////////////////// 



module.exports = router;


