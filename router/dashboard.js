const {Router} = require("express");

const adminController = require('../controller/adminController')
const {authintecated} = require('../middleware/auth')

const router = new Router();

// dashboard home page
router.get('/', authintecated, adminController.getDashboard)


// add new post page
router.get('/add-post', authintecated, adminController.getAddPost)

// get  edit post page
router.get('/edit-post/:id', authintecated, adminController.getEditPost)

// delete post
router.get('/delete-post/:id', authintecated, adminController.deletePost)

// get dashboard profile page
router.get('/user-profile/:id', authintecated, adminController.getUserDashProfile)


// get dashboard Setting page 


// get dashboard Setting page
router.get('/setting/:id', authintecated, adminController.getDashSetting)


// handle change profile full name email  password and picture
router.post('/change-profile/:id', authintecated, adminController.changeUserInfo)


// edit post handling
router.post('/edit-post/:id', authintecated, adminController.editPost)


// add and handel post image
router.post('/add-post', authintecated, adminController.createPost)


module.exports = router