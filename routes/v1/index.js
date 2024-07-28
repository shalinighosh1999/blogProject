var express = require('express');
var router = express.Router();



const middleware = require('../../service/middleware').middleware;
const cron=require('node-cron')


var adminsRouter=require('./admin')
var usersRouter=require('./user')




////////////////////////////////////////////////// ************************  ADMIN AND USER AUTH   ************************  ////////////////////////////////////////////////// 
const admin=require('../../controllers/auth/admin')
router.get('/test',admin.test)

router.post('/admin/adminreg',admin.adminRegister)
router.post('/admin/login',admin.admin_login)


const user=require('../../controllers/auth/user')

router.post('/user/userReg',user.userRegister)
router.post('/user/login',user.user_login)

////////////////////////////////////////////////// ************************  MIDDLEWARE    ************************  ////////////////////////////////////////////////// 

router.use(middleware); 

router.use('/admin',adminsRouter)
router.use('/user',usersRouter)
module.exports = router;