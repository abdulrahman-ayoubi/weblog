const Blog = require('../model/blog')
const User = require('../model/User')
const Comment = require('../model/comment')
const {commentValidation} = require("../model/secure/commentValidation");
const {contactSchema} = require("../model/secure/contactValidator");
const {formatDate} = require('../utils/formatDate')
const {get404, get500} = require("./errorController");
const {truncate} = require("../utils/truncate");

const validator = require("fastest-validator");
const Captcha = require("captchapng")


const v = new validator();
let CAPTCHA_NUM


//! render weblog home page
exports.getBlog = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 50;
    const numberOfPosts = await Blog.find({status: "public"}).countDocuments();

    try {

        const posts = await Blog.find({status: 'public'}).sort({createdAt: 'desc'})
            .skip((page - 1) * postPerPage)
            .limit(postPerPage);
        res.render('index', {
            pageTitle: 'Weblog home page',
            path: "/",
            formatDate,
            posts,
            truncate,
            page,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
            numberOfPosts,

        })
    } catch (err) {
        console.log(err)
        get500(req, res)

    }
};


//! handle search
exports.handleSearch = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 50;
    const numberOfPosts = await Blog.find({
        status: "public",
        $text: {$search: req.body.search}
    })
        .countDocuments();

    try {

        const posts = await Blog.find({
            status: 'public',
            $text: {$search: req.body.search}
        }).sort({createdAt: 'desc'})

            .skip((page - 1) * postPerPage)
            .limit(postPerPage);
        if (req.body.search === '') {
            res.redirect('/')
        }
        res.render('index', {
            pageTitle: 'Weblog home page',
            path: "/",
            formatDate,
            posts,
            truncate,
            page,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
            numberOfPosts,

        })
    } catch (err) {
        console.log(err)
        get500(req, res)

    }
}
//! render single post page
exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({_id: req.params.id}).populate("user");
        const comment = await Comment.find({postId: post._id}).populate("userId")

        if (!post) {
            get404(req, res)
        }
        res.render('includes/singlePost', {
            pageTitle: post.title,
            formatDate,
            path: '/post',
            url: post.user._id,
            post,
            fullName: comment.postId,
            comment,
            layout: "./layouts/mainLayout.ejs",
            message: req.flash("success_msg")

        })
    } catch (err) {
        console.log(err)
        get500(req, res)
    }
}

//! send comment handling

exports.SendComment = async (req, res) => {
    const post = await Blog.findOne({_id: req.params.id}).populate("user");

    //? show comment in page
    const comment = await Comment.find({postId: post._id}).populate("userId")
    try {

        if (!post) {
            get404(req, res)
        }

        //? validate comment
        const validate = v.validate(req.body, commentValidation)
        if (validate === true) {
            //? add comment to database
            await Comment.create({comment: req.body.comment, userId: req.user.id, postId: req.params.id});

            req.flash("success_msg", "the comment successfully send.")
            res.redirect(`/post/${post.id}`);
        } else {
            res.render('includes/singlePost', {
                pageTitle: post.title,
                formatDate,
                path: '/post',
                url: post.user._id,
                post,
                fullName: comment.postId,
                comment,
                layout: "./layouts/mainLayout.ejs",
                message: '',
                errors: validate

            })
        }
    } catch (err) {
        console.log(err);
        get500(req, res)
    }

}


//! handle profile page
exports.getProfile = async (req, res) => {
    try {
        const posts = await Blog.find({user: req.params.id}).sort({createdAt: 'desc'})
        //find user full name
        const user = await User.findOne({_id: req.params.id})
        if (posts) {
            res.render('includes/userPage.ejs', {
                pageTitle: `${user.fullName} profile page`,
                posts,
                user,
                formatDate,
                fullName: user.fullName,
                path: '/user-page',
                truncate
            })
        }
        get404(req, res)
    } catch (err) {
        console.log(err)
        get500(req, res)
    }
}

//! get contact us page
exports.getContact = (req, res) => {
    res.render("contact", {
        pageTitle: "Contact Us",
        message: req.flash("success_msg"),
        path: "/contact-us"
    })
}
///! handle contact page
exports.handleContact = async (req, res) => {
    try {
        const errorArr = [];

        const validate = await v.validate(req.body, contactSchema);

        if (validate === true) {

            if (req.body.captcha != CAPTCHA_NUM) {
                errorArr.push({message: 'The security code is incorrect.'})
                res.render("contact", {
                    pageTitle: "Contact Us",
                    message: req.flash("success_msg"),
                    path: "/contact-us",
                    errors: errorArr
                })
            }
            req.flash('success_msg', " your message successfully send.");

            res.render("contact", {
                pageTitle: "Contact Us",
                message: req.flash("success_msg"),
                path: "/contact-us"
            })

        } else {
            res.render("contact", {
                pageTitle: "Contact Us",
                message: req.flash("success_msg"),
                path: "/contact-us",
                errors: validate
            })
        }


    } catch (err) {
        console.log(err)
        get500(req, res)
    }
}

exports.getCaptcha = (req, res) => {

    try {
        CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000)

        const p = Captcha(100, 30, CAPTCHA_NUM);
        p.color(249, 139, 122);
        p.color(251, 193, 0)
        const img = p.getBase64()
        const imgBase64 = new Buffer.from(img, "base64")
        res.send(imgBase64)

    } catch (err) {
        console.log(err)
        get500(req, res)
    }


}