const http = require('http');

const express = require('express');
const expressHbs = require('express-handlebars');
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

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);