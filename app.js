// const { sequelize } = require('./models')

// async function main() {
//     await sequelize.sync({ alter: true })
// }

// main()

const express = require('express')
const path = require('path')
const app = express()
var cookieParser = require('cookie-parser');

app.use(express.json())
const indexRouter = require('./routes/index')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const session = require("express-session");
const flash = require("express-flash");

const passport = require('passport')
require("./config/passport_admin")(passport)
require("./config/passport_main_user")(passport)

app.use(passport.initialize())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.session())
app.use('/', indexRouter);
app.use(flash());

port = process.env.PORT || 3000;

app.listen({ port }, async() => {
    console.log('Server up on http://localhost:3000')
    console.log('Database Connected!')
})

module.exports = app