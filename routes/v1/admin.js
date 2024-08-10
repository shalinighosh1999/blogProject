var express = require('express');
var router = express.Router();
const cron=require('node-cron')




const multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage });

////////////////////////////////////////////////// ************************  ADMIN AND USER AUTH   ************************  ////////////////////////////////////////////////// 
const adminauthcontroller=require('../../controllers/auth/admin')

router.post('/changepw',adminauthcontroller.changePassword)
router.post('/upload', upload.single("image"), adminauthcontroller.imageUpload);


////////////////////////////////////////////////// ************************  blog category   ************************  ////////////////////////////////////////////////// 

const blogcategory=require('../../controllers/blog/admin/blogcategoryAdmin')

router.post('/createblogcate',blogcategory.createBlogCategory)
router.get('/getblogcats',blogcategory.getAllBlogCategories)
router.put('/updateblogcate/:id', blogcategory.updateBlogCategory);
router.delete('/deleteblogcate/:id', blogcategory.deleteBlogCategory);


////////////////////////////////////////////////// ************************  blogs   ************************  ////////////////////////////////////////////////// 

const blogController = require('../../controllers/blog/user/bloguser'); 

router.post('/createblog', blogController.createBlog_admin);
router.get('/getblogs', blogController.getAllBlogs);
router.get('/getblog/:id', blogController.getBlogById);
router.put('/updateblog/:id', blogController.updateBlog);
router.delete('/deleteblog/:id', blogController.deleteBlog);
router.post('/getblogsbycategory', blogController.getBlogsByCategory);
router.post('/getblogsbyblogid', blogController.getBlogsByCategoryId);

module.exports = router;


