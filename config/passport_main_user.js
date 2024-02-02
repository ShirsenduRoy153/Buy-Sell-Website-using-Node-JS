const user = require('../models').user;
const localStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    passport.use("local_main_user", new localStrategy({
        usernameField: "phone",
        passwordField: "password",
        passReqToCallback: true
    }, (req, phone, password, done) => {
        const users = user.findOne({ raw: true, where: { phone: phone } }).then((users) => {
            if (users == null) {
                return done(null, false);
            } else if (password === users.password) {
                return done(null, users)
            } else {
                return done(null, false);
            }

        })
    }))
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        const fetchuser = (id) => user.findByPk(id);
        fetchuser(id).then((user) => {
            return done(null, user);
        })
    });
};