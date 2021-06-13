const fs = require('fs');
const path = require('path');

const baseDir = require('../util/path');
const p = path.join(baseDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        }
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => console.log(err));
        });
    }

    static async fetchAll(cb) {
        getProductsFromFile(cb);
    }
};