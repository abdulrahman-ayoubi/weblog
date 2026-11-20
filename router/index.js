const {Router} = require('express');


const blogController = require('../controller/blogController')
const {authintecated} = require("../middleware/auth");

const router = new Router();

//?  weblog home page
router.get('/', blogController.getBlog)

// ? single post page
router.get('/post/:id', blogController.getSinglePost)

// ? user profile page
router.get('/user-profile/:id', blogController.getProfile)

// ? contact us page
router.get('/contact', blogController.getContact)


// ? get captcha png
router.get('/captcha.png', blogController.getCaptcha)

//? handle search
router.post('/search', blogController.handleSearch)

//? handle send message from contact us
router.post('/contact', blogController.handleContact)

//? handle send comment
router.post('/post/send-comment/:id', authintecated, blogController.SendComment)


module.exports = router