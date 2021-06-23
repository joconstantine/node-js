const http = require('http');

const express = require('express');
const path = require('path');

const app = express();

// set the template (views) path
app.set('views', 'views');

// EJS
app.set('view engine', 'ejs');

const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const isAuth = require('./middleware/is-auth');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');
const MONGODB_URL = 'mongodb+srv://joconstantine:' + process.env.MONGO_DB_PASSWORD + '@cluster0.d1bhv.mongodb.net/shop?retryWrites=true&w=majority'
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions',
});
const csrfProtection = csrf();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
    secret: 'my scret',
    resave: false, //only save when there are changes,
    saveUninitialized: false,
    store: store,
})); //initialize the session
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next(); //proceed
            })
            .catch(err => console.log(err));
    }
});

// To set csrfToken and isAuthenticated for all views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));