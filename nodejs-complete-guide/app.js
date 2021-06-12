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

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
})

app.listen(3000);