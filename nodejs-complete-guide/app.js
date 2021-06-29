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
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const filename = new Date().toISOString().split(":")[0] + new Date().getSeconds() + new Date().getMilliseconds() + "-" + file.originalname;
        console.log(filename);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.minetype == "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const User = require('./models/user');
const MONGODB_URL = 'mongodb+srv://joconstantine:' + process.env.MONGO_DB_PASSWORD + '@cluster0.d1bhv.mongodb.net/shop?retryWrites=true&w=majority'
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions',
});
const csrfProtection = csrf();

app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(express.static(path.join(rootDir, 'public')));
app.use('/images', express.static(path.join(rootDir, 'images')));

app.use(session({
    secret: 'my scret',
    resave: false, //only save when there are changes,
    saveUninitialized: false,
    store: store,
})); //initialize the session
app.use(csrfProtection);
app.use(flash());

// To set csrfToken and isAuthenticated for all views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findById(req.session.user._id)
            .then(user => {
                if (!user) {
                    return next();
                }
                req.user = user;
                next(); //proceed
            })
            .catch(err => {
                next(err);
            });
    }
});

app.use('/admin', isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error);
    return res.status(500).render(
        '500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
})

mongoose.connect(MONGODB_URL)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));