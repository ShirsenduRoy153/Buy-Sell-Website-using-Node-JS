const admin = require('../models').admin;
//const { hashSync, compareSync } = require('bcrypt');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    passport.use("local", new localStrategy({
        usernameField: "phone",
        passwordField: "password",
        passReqToCallback: true
    }, (req, phone, password, done) => {
        const user = admin.findOne({ raw: true, where: { phone: phone } }).then((user) => {
            if (user == null) {
                return done(null, false);
            } else if (password === user.password) {
                return done(null, user)
            } else {
                return done(null, false);
            }

        })
    }))
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        const fetchuser = (id) => admin.findByPk(id);
        fetchuser(id).then((user) => {
            return done(null, user);
        })
    });
};