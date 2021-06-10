const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Hello</title></head>');
        res.write('<body><p>Welcome to my page!</p></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Hello</title></head>');
        res.write('<body>');
        res.write('<h1>Hello from my Node.js!</h1>');
        res.write('<ul>' +
            '<li>User 1</li>' +
            '<li>User 2</li>' +
            '<li>User 3</li>' +
            '<li>User 4</li>' +
            '</ul>');
        res.write('<form method="POST" action="/create-user">');
        res.write('<input name="username" type="text">');
        res.write('<button type="submit">Submit</button></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(message);
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            return res.end();
        });
    }


};

module.exports = requestHandler;