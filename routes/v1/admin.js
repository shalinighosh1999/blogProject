var express = require('express');
var router = express.Router();
const cron=require('node-cron')




const multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

////////////////////////////////////////////////// ************************  ADMIN AND USER AUTH   ************************  ////////////////////////////////////////////////// 
const adminauthcontroller=require('../../controllers/auth/admin')

router.post('/changepw',adminauthcontroller.changePassword)

module.exports = router;


