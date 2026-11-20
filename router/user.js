const {Router} = require("express");

const userController = require("../controller/userController")
const {authintecated} = require('../middleware/auth')

const router = new Router();


// login page
router.get('/login', userController.loginPage);


// log out the user
router.get('/logout', authintecated, userController.logOut);


// register page
router.get('/register', userController.registerPage);


// register captcha
router.get('/register/register-captcha.png', userController.captchaPng);


// handle register
router.post('/register', userController.createUser);

// handle login page
router.post('/login', userController.handleLogin, userController.remember);
module.exports = router