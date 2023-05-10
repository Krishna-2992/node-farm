// const fs = require('fs')

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')

// const textOut = `About Avocado: ${textIn}`

// fs.writeFileSync('./txt/output.txt', textOut)
// console.log("created the file in txt dirextory");

const url = require('url');
const http = require('http');
const fs = require('fs');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const templateProducts = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template_card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map((el) => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        res.end(output);
    }

    //products
    else if (pathname === '/product') {
        const product = dataObj[query.id];
        console.log(product);
        const output = replaceTemplate(templateProducts, product);
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(output);
        // res.end("product page")
    }

    //api
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    }

    //page not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000');
});
