var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });




////////////////////////////////////////////////// ************************  ADMIN AND USER AUTH   ************************  ////////////////////////////////////////////////// 

const userauthcontroller=require('../../controllers/auth/user')

router.post('/changepw',userauthcontroller.changePassword_user)


module.exports = router;





