exports.authintecated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash('error', 'you should first login.')
        res.redirect('/users/login')

    }
}