const validator = require('fastest-validator');
const multer = require('multer');
const sharp = require('sharp');
const shortid = require('shortid');
const rootPath = require('app-root-path');
const bcryptjs = require('bcryptjs');

const User = require("../model/User");

const fs = require('fs')
// multer file mimetype options
const {fileFilter} = require('../utils/multer')
// errors page
const {get404, get500} = require('./errorController')
// Blog schema mongoose
const Blog = require('../model/blog')
const {formatDate} = require('../utils/formatDate') //? change date format
// post page schema
const {postSchema} = require('../model/secure/postValidation');

// edit profile page schema
const {editProfileSchema} = require('../model/secure/editProfileValidation');


const v = new validator();


//! user blog page post page
exports.getDashboard = async (req, res) => {
	
	try {
		//? find user id for profile page
		const page = +req.query.page || 1;
		const postPerPage = 10;
		const numberOfPosts = await Blog.find({user: req.user._id,}).countDocuments();
		const blog = await Blog.find({user: req.user.id}).sort({createdAt: 'desc'})
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);
		if (req.query.page > numberOfPosts / 5) {
			res.redirect('/error/404')
		} else {
			res.render('admin/blog', {
				user: req.user.id,
				pageTitle: `${req.user.fullName} dashboard`,
				path: "/dashboard",
				layout: "./layouts/dashLayout",
				fullName: req.user.fullName,
				message: req.flash('success_msg'),
				blog,
				formatDate,
				page,
				currentPage: page,
				nextPage: page + 1,
				previousPage: page - 1,
				hasNextPage: postPerPage * page < numberOfPosts,
				hasPreviousPage: page > 1,
				lastPage: Math.ceil(numberOfPosts / postPerPage),
				numberOfPosts,
			})
		}
		
		
	}
	catch (err) {
		
		console.log(err)
		get500(req, res)
	}
	
}

//! handle search
exports.handleSearch = async (req, res) => {
	
	try {
		//? find user id for profile page
		const page = +req.query.page || 1;
		const postPerPage = 10;
		const numberOfPosts = await Blog.find({user: req.user._id, $text: {$search: req.body.search}}).countDocuments();
		const blog = await Blog.find({user: req.user.id, $text: {$search: req.body.search}}).sort({createdAt: 'desc'})
			.skip((page - 1) * postPerPage)
			.limit(postPerPage);
		if (req.body.search === '') {
			res.redirect("/dashboard")
		}
		if (req.query.page > numberOfPosts / 5) {
			res.redirect('/error/404')
		} else {
			res.set(
				"Cache-Control",
				"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
			);
			res.render('admin/blog', {
				user: req.user.id,
				pageTitle: `${req.user.fullName} dashboard`,
				path: "/dashboard",
				layout: "./layouts/dashLayout",
				fullName: req.user.fullName,
				message: req.flash('success_msg'),
				blog,
				formatDate,
				page,
				currentPage: page,
				nextPage: page + 1,
				previousPage: page - 1,
				hasNextPage: postPerPage * page < numberOfPosts,
				hasPreviousPage: page > 1,
				lastPage: Math.ceil(numberOfPosts / postPerPage),
				numberOfPosts,
			})
		}
		
		
	}
	catch (err) {
		
		console.log(err)
		get500(req, res)
	}
}

//! dashboard profile page
exports.getDashSetting = async (req, res) => {
	
	try {
		//? find user. by id
		
		const userInfo = await User.findOne({_id: req.params.id});
		
		//? check user id with log id
		
		if (String(userInfo.id) !== String(req.user.id)) get404(req, res)
		
		res.render("admin/dashProfile", {
			pageTitle: `${req.user.fullName} profile page`,
			path: '/setting',
			userInfo,
			user: req.user.id,
			fullName: req.user.fullName,
			layout: './layouts/dashLayout.ejs',
			message: ''
		})
	}
	catch (err) {
		console.log(err)
		get500(req, res)
	}
}
exports.getUserDashProfile = async (req, res) => {
	try {
		res.redirect(`/user-profile/${req.user.id}`)
		
	}
	catch (err) {
		console.log(err)
		get500(req, res)
	}
}

//! handle change user profile full name , email ,  password and profile picture
exports.changeUserInfo = async (req, res) => {
	const errorArr = [];
	
	
	try {
		const userInfo = await User.findOne({_id: req.user.id});
		
		const ChangeProfilePicture = multer({
			fileFilter
		}).single('image')
		ChangeProfilePicture(req, res, async err => {
			if (err) {
				if (err === 'mimetype-error') {
					errorArr.push({message: "just support png , jpg and jpeg files"})
					res.render("admin/dashProfile", {
						pageTitle: `${req.user.fullName} profile page`,
						path: '/setting',
						userInfo,
						user: req.user.id,
						fullName: req.user.fullName,
						layout: './layouts/dashLayout.ejs',
						errors: errorArr,
						message: ''
					})
				}
			}
			const validate = await v.validate(req.body, editProfileSchema);
			if (validate === true) {
				if (req.body.confirmPassword !== req.body.password) {
					errorArr.push({message: "new password and repeat new password is not equal! "});
					res.render('admin/dashProfile', {
						pageTitle: `${req.user.fullName} profile page`,
						path: '/setting',
						userInfo,
						user: req.user.id,
						fullName: req.user.fullName,
						layout: './layouts/dashLayout.ejs',
						errors: errorArr,
						message: ''
					})
				}
				const {email, password, fullName} = req.body;
				
				//? hash the password
				const hash = await bcryptjs.hash(password, 10);
				userInfo.fullName = fullName;
				userInfo.email = email;
				userInfo.password = hash;
				userInfo.save();
				
				req.flash('success_msg', 'Profile successfully edited.');
				res.render('admin/dashProfile', {
					pageTitle: `${req.user.fullName} profile page`,
					path: '/setting',
					userInfo,
					user: req.user.id,
					fullName: req.user.fullName,
					layout: './layouts/dashLayout.ejs',
					errors: errorArr,
					message: req.flash("success_msg")
				})
				
			} else {
				res.render('admin/dashProfile', {
					pageTitle: `${req.user.fullName} profile page`,
					path: '/setting',
					userInfo,
					user: req.user.id,
					fullName: req.user.fullName,
					layout: './layouts/dashLayout.ejs',
					errors: validate,
					message: ''
				})
			}
			if (req.file && validate === true) {
				try {
					
					const fileName = `${shortid.generate()}_${req.file.originalname}`;
					const uploadPath = `${rootPath}/public/uploads/profile/${fileName}`
					await sharp(req.file.buffer).png({
						quality: 30
					}).resize(193, 190).toFile(uploadPath)
					await sharp(req.file.buffer).jpeg({
						quality: 30
					}).resize(193, 190).toFile(uploadPath)
					if (String(userInfo.imagePath) !== "default/Annotation 2023-11-27 183522.png") {
						fs.unlink(`${rootPath}/public/uploads/profile/${userInfo.imagePath}`, err => {
							if (err) get500(req, res)
						})
					}
					const {email, password, fullName} = req.body;
					
					//? hash the password
					const hash = await bcryptjs.hash(password, 10);
					userInfo.fullName = fullName;
					userInfo.email = email;
					userInfo.imagePath = fileName;
					userInfo.password = hash;
					await userInfo.save();
					req.flash('success_msg', 'Profile successfully edited.')
					res.render('admin/dashProfile', {
						pageTitle: `${req.user.fullName} profile page`,
						path: '/setting',
						userInfo,
						user: req.user.id,
						fullName: req.user.fullName,
						layout: './layouts/dashLayout.ejs',
						message: req.flash('success_msg')
					})
					
				}
				catch (err) {
					console.log(err)
					errorArr.push({message: "the file has some problem please try with another picture."});
					res.render('admin/dashProfile', {
						pageTitle: `${req.user.fullName} profile page`,
						path: '/setting',
						userInfo,
						user: req.user.id,
						fullName: req.user.fullName,
						layout: './layouts/dashLayout.ejs',
						errors: errorArr,
						message: ''
					})
				}
			}
			
		})
		
	}
	catch (err) {
		console.log(err);
		get500(req, res)
	}
	
}


//! add new post page
exports.getAddPost = async (req, res) => {
	try {
		
		res.render('admin/addPost', {
			pageTitle: `${req.user.fullName} Add new post`,
			path: "/dashboard/add-post",
			layout: "./layouts/dashLayout",
			fullName: req.user.fullName,
			user: req.user.id,
			
		})
	}
	catch (err) {
		console.log(err);
		get500(req, res)
	}
}


// ! add image and  post
exports.createPost = (req, res) => {
	
	const errorArr = [];
	//?multer options
	const upload = multer({
		fileFilter,
		limits: {fileSize: 4000000},
	}).single('image')
	upload(req, res, async (err) => {
		if (err) {
			//? check file size
			if (err.code === 'LIMIT_FILE_SIZE') {
				errorArr.push({message: "The file size is big from 4MB."})
				res.render('admin/addPost', {
					pageTitle: `${req.user.fullName} Add new post`,
					path: "/dashboard/add-post",
					layout: "./layouts/dashLayout",
					fullName: req.user.fullName,
					user: req.user.id,
					errors: errorArr
				})
				//? check file extension
			} else if (err === 'mimetype-error') {
				errorArr.push({message: "just support png , jpeg and jpg pictures."})
				res.render('admin/addPost', {
					pageTitle: `${req.user.fullName} Add new post`,
					path: "/dashboard/add-post",
					layout: "./layouts/dashLayout",
					fullName: req.user.fullName,
					user: req.user.id,
					errors: errorArr,
				})
			}
		} else {
			//? check post validation
			const validate = v.validate(req.body, postSchema);
			if (validate !== true) {
				res.render('admin/addPost', {
					pageTitle: `${req.user.fullName} Add new post`,
					path: "/dashboard/add-post",
					layout: "./layouts/dashLayout",
					fullName: req.user.fullName,
					user: req.user.id,
					errors: validate
				})
			}
			//? check file and validation true
			if (req.file && validate === true) {
				const fileName = `${shortid.generate()}_${req.file.originalname}`;
				const uploadPath = `${rootPath}/public/uploads/images/${fileName}`
				try {
					//? compress files
					await sharp(req.file.buffer).png({
						quality: 50,
					})
						.jpeg({
							quality: 50
						}).toFile(uploadPath)
					
					//? add post to database
					await Blog.create({...req.body, imagePath: fileName, user: req.user.id})
					req.flash('success_msg', 'your post successfully added')
					res.redirect('/dashboard')
					
				}
				catch (err) {
					//? if file has some problem
					errorArr.push({message: "! The file has some problem. please try with another picture."})
					res.render('admin/addPost', {
						pageTitle: `${req.user.fullName} Add new post`,
						path: "/dashboard/add-post",
						layout: "./layouts/dashLayout",
						fullName: req.user.fullName,
						user: req.user.id,
						errors: errorArr
					})
				}
			} else {
				//? check if file not exist
				errorArr.push({message: "please choose a picture for your post."})
				errorArr.push({message: "The picture size must be less than from 4MB."})
				res.render('admin/addPost', {
					pageTitle: `${req.user.fullName} Add new post`,
					path: "/dashboard/add-post",
					layout: "./layouts/dashLayout",
					fullName: req.user.fullName,
					errors: errorArr,
					user: req.user.id,
				})
			}
		}
	})
}


//! render edit user post page
exports.getEditPost = async (req, res) => {
	
	try {
		
		//? take post ID
		const post = await Blog.findOne({_id: req.params.id});
		if ( !post) {
			//? check post is exist
			res.redirect('/dashboard')
		}
		if (String(post.user) !== String(req.user.id)) {
			
			//? check post is from this user
			
			res.redirect('errors/404')
		} else {
			
			res.render('admin/editPost', {
				pageTitle: `${req.user.fullName} edit post`,
				path: "/dashboard/edit-post",
				layout: "./layouts/dashLayout",
				fullName: req.user.fullName,
				post,
				user: req.user.id
			})
		}
	}
	catch (err) {
		console.log(err)
	}
};

//! handle edit post
exports.editPost = async (req, res) => {
	const errorArr = [];
	//? take post ID
	
	const post = await Blog.findOne({_id: req.params.id});
	
	if ( !post) {
		
		//? check post is exist
		
		return res.redirect('/dashboard')
	}
	if (String(post.user) !== String(req.user.id)) {
		
		//? check post is from this user
		
		return get404(req, res)
	}
	
	//? multer options
	const deletePicture = multer({
		fileFilter,
		limits: {fileSize: 4000000},
	}).single('image')
	
	try {
		deletePicture(req, res, async err => {
			if (err) {
				//? check file extension
				if (err === 'mimetype-error') {
					errorArr.push({message: 'just support pnj , jpeg and jpg files.'})
					return res.render('admin/editPost', {
						pageTitle: `${req.user.fullName} edit post`,
						path: "/dashboard/edit-post",
						layout: "./layouts/dashLayout",
						fullName: req.user.fullName,
						post,
						user: req.user.id,
						errors: errorArr
					})
					
					//? check file size
				} else if (err.code === 'LIMIT_FILE_SIZE') {
					errorArr.push({message: "The file size is big from 4MB."})
					return res.render('admin/editPost', {
						pageTitle: `${req.user.fullName} Add new post`,
						path: "/dashboard/edit-post",
						layout: "./layouts/dashLayout",
						fullName: req.user.fullName,
						post,
						user: req.user.id,
						errors: errorArr,
						
					})
				}
			}
			const validate = v.validate(req.body, postSchema)
			if (validate === true) {
				//? add edit and save in database if file not add
				
				const {title, status, body} = req.body;
				post.title = title;
				post.status = status;
				post.body = body;
				await post.save();
				
				req.flash('success_msg', 'The post successfully edited.');
				res.redirect("/dashboard")
				
				if (req.file && validate === true) {
					
					const fileName = `${shortid.generate()}_${req.file.originalname}`;
					const uploadPath = `${rootPath}/public/uploads/images/${fileName}`
					try {
						//? compress files
						await sharp(req.file.buffer)
							.png({
								quality: 50
							})
							.jpeg({
								quality: 50
							})
							.toFile(uploadPath)
						
						fs.unlink(`${rootPath}/public/uploads/images/${post.imagePath}`, async err => {
							if (err) throw err;
							
						})
						//? add post to database
						const {title, status, body} = req.body;
						post.title = title;
						post.status = status;
						post.body = body;
						post.imagePath = fileName;
						await post.save();
						
						req.flash('success_msg', 'The post successfully edited.')
						res.redirect('/dashboard')
						
					}
					catch (err) {
						errorArr.push({message: "! the has some problem please try with another picture."})
						return res.render('admin/editPost', {
							pageTitle: `${req.user.fullName} edit post`,
							path: "/dashboard/edit-post",
							layout: "./layouts/dashLayout",
							fullName: req.user.fullName,
							post,
							user: req.user.id,
							errors: errorArr
						})
						
					}
				}
			} else {
				//? if validation become fail
				return res.render('admin/editPost', {
					pageTitle: `${req.user.fullName} edit post`,
					path: "/dashboard/edit-post",
					layout: "./layouts/dashLayout",
					fullName: req.user.fullName,
					post,
					user: req.user.id,
					errors: validate
				})
			}
		})
	}
	catch (err) {
		get500(req, res)
	}
}

//! delete post
exports.deletePost = async (req, res) => {
	try {
		//? take file ID
		const post = await Blog.findOne({_id: req.params.id});
		if ( !post) {
			
			//? check post is exist
			
			return res.redirect("/dashboard")
		}
		
		//? check post is from this user
		
		if (String(post.user) !== String(req.user.id)) {
			return res.redirect("/error/404")
			
		}
		
		//? delete post from database
		
		await Blog.findByIdAndDelete({_id: req.params.id});
		fs.unlink(`${rootPath}/public/uploads/images/${post.imagePath}`, err => {
			if (err) throw err
			req.flash('success_msg', "the post successfully deleted.")
			res.redirect('/dashboard');
		})
		
	}
	catch (err) {
		console.log(err);
		get500(req, res)
	}
	
}

