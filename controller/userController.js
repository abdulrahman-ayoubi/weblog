/** @format */

const bcrypt = require('bcryptjs');
const passport = require('passport');
const validator = require('fastest-validator');
const Captcha = require('captchapng');

const { schema } = require('../model/secure/userValidation');
const User = require('../model/User');
const { sendEmail } = require('../utils/mailer');

const v = new validator();

exports.loginPage = (req, res) => {
	res.set(
		'Cache-Control',
		'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
	);

	res.render('login', {
		pageTitle: 'Login user',
		path: '/login',
		message: req.flash('success_msg'),
		errors: req.flash('error'),
		layout: './layouts/logLayout.ejs',
	});
};

exports.handleLogin = (req, res, next) => {
	if (req.body.email === '') {
		req.flash('error', 'email is required');
	}

	if (req.body.password === '') {
		req.flash('error', 'password is required');
	}

	passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
};

exports.logOut = (req, res) => {
	res.set(
		'Cache-Control',
		'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0',
	);

	req.logOut(() => {
		req.flash('success_msg', 'successfully exit from dashboard.');
		res.redirect('/users/login');
	});
};

exports.remember = (req, res) => {
	if (req.body.remember) {
		req.session.cookie.originalMaxAge = 48 * 60 * 60 * 1000;
	} else {
		req.session.cookie.originalMaxAge = null;
	}

	res.redirect('/dashboard');
};

exports.registerPage = (req, res) => {
	res.render('register', {
		pageTitle: 'Sign up user',
		path: '/register',
		layout: './layouts/logLayout.ejs',
	});
};

exports.createUser = async (req, res) => {
	const errorArr = [];
	const validate = await v.validate(req.body, schema);

	const { email, password, fullName, confirmPassword, captcha } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		errorArr.push({
			message: 'you already have an account with this email.',
		});

		return res.render('register', {
			pageTitle: 'Sign up user',
			path: '/register',
			errors: errorArr,
			layout: './layouts/logLayout.ejs',
		});
	}

	if (validate !== true) {
		return res.render('register', {
			pageTitle: 'Sign up user',
			path: '/register',
			layout: './layouts/logLayout.ejs',
			errors: validate,
		});
	}

	if (password !== confirmPassword) {
		errorArr.push({
			message: 'repeat the password not much.',
		});

		return res.render('register', {
			pageTitle: 'Sign up user',
			path: '/register',
			errors: errorArr,
			layout: './layouts/logLayout.ejs',
		});
	}

	if (!req.session.captcha || String(captcha) !== String(req.session.captcha)) {
		errorArr.push({
			message: 'The security code is incorrect.',
		});

		return res.render('register', {
			pageTitle: 'Sign up user',
			path: '/register',
			layout: './layouts/logLayout.ejs',
			errors: errorArr,
		});
	}

	delete req.session.captcha;

	const hash = await bcrypt.hash(password, 10);

	await User.create({
		fullName,
		email,
		password: hash,
	});
	console.log(req.body);
	console.log('captcha:', req.body.captcha);
	console.log('session:', req.session.captcha);
	console.log('session:', req.session.captcha);

	req.flash('success_msg', 'create account successfully completed');

	res.redirect('/users/login');
};

exports.captchaPng = (req, res) => {
	const captchaNum = Math.floor(Math.random() * 9000) + 1000;

	req.session.captcha = captchaNum;

	const p = new Captcha(100, 30, captchaNum);

	p.color(249, 139, 122);
	p.color(251, 193, 0);

	const imgBase64 = p.getBase64();
	const imgBuffer = Buffer.from(imgBase64, 'base64');

	console.log('Generated CAPTCHA:', captchaNum);
	console.log('Session CAPTCHA:', req.session.captcha);

	res.type('png').send(imgBuffer);
};
