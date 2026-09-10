'use strict';

const path = require('path');
const express = require('express');
const { categories } = require('./src/products');
const { renderPage } = require('./src/template');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

categories.forEach(function (cat) {
    app.get('/' + cat.slug, function (req, res) {
        res.send(renderPage(cat));
    });
});

app.get('/', function (req, res) {
    res.redirect('/' + categories[0].slug);
});

app.use(function (req, res) {
    res.status(404).send('Not found — valid pages: /' + categories.map(function (c) { return c.slug; }).join(', /') + '.');
});

app.listen(PORT, function () {
    console.log('Suki Trading POS running at http://localhost:' + PORT);
    console.log('Pages: ' + categories.map(function (c) { return '/' + c.slug; }).join(' '));
});