exports.get404 = (req, res) => {
    res.status(405).render('errors/404', {
        pageTitle: "404 || Not Found",
        path: '/404'
    })
}
exports.get500 = (req, res) => {
    res.status(500).render('errors/500', {
        path: '/404',
        pageTitle: "500 || server error"
    })
}
