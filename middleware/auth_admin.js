module.exports = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/post_admin_login")
}