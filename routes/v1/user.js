var express = require('express');
var router = express.Router();
const multer = require("multer");
const path = require("path");
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });




////////////////////////////////////////////////// ************************  ADMIN AND USER AUTH   ************************  ////////////////////////////////////////////////// 

const userauthcontroller=require('../../controllers/auth/user')

router.post('/changepw',userauthcontroller.changePassword_user)


////////////////////////////////////////////////// ************************  blog    ************************  ////////////////////////////////////////////////// 

const blogController = require('../../controllers/blog/user/bloguser'); 

router.post('/createblog_user', blogController.createBlog);
router.get('/getblogs_user', blogController.getAllBlogs);
router.get('/getblog_user/:id', blogController.getBlogById);
router.put('/updateblog_user/:id', blogController.updateBlog);
router.delete('/deleteblog-user/:id', blogController.deleteBlog);
router.post('/getblogsbycategory_user', blogController.getBlogsByCategory);
router.post('/getblogsbyblogid_user', blogController.getBlogsByCategoryId);

////////////////////////////////////////////////// ************************  blog like   ************************  ////////////////////////////////////////////////// 

const likecontroller=require('../../controllers/blog/user/bloglike')

router.post('/bloglike_user',likecontroller.createbloglike)

////////////////////////////////////////////////// ************************  blog comment   ************************  ////////////////////////////////////////////////// 

const commentcontroller=require('../../controllers/blog/user/comment')
router.post('/blogcomment_user',commentcontroller.createComment)
router.put('/updatecomment_user/:commentId', commentcontroller.updateComment);
router.delete('/deletecomment_user/:commentId', commentcontroller.deleteComment);

module.exports = router;





