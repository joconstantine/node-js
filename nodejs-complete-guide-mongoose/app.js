const http = require('http');

const express = require('express');
// const expressHbs = require('express-handlebars');
const path = require('path');

const app = express();

// set the template (views) path
app.set('views', 'views');

// Pug Engine
// app.set('view engine', 'pug');

// Handlebars Engine - Not installed within Express
// app.engine('hbs', expressHbs({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' }));
// app.set('view engine', 'hbs');

// EJS
app.set('view engine', 'ejs');

const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));
app.use((req, res, next) => {
    User.findById('60d0a7decf28c92e8000128c')
        .then(user => {
            req.user = user;
            next(); //proceed
        })
        .catch(err => console.log(err));

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://joconstantine:' + process.env.MONGO_DB_PASSWORD + '@cluster0.d1bhv.mongodb.net/shop?retryWrites=true&w=majority')
    .then(() => {
        User.findOne().then(
            user => {
                if (!user) {
                    user = new User({
                        name: 'Jo Constantine',
                        email: 'constantine@company.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            }
        );
        app.listen(3000);
    })
    .catch(err => console.log(err));