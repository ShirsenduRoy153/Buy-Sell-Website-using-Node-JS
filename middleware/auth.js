module.exports = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/admin_login")
}