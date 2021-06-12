const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../util/path');

const products = [];

router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {
        pageTitle: 'Add Product', path: '/admin/add-product',
        productCSS: true, activeAddProduct: true
    });
});

router.post('/add-product', (req, res, next) => {
    products.push(req.body);
    res.redirect('/');
});

exports.routes = router;
exports.products = products;