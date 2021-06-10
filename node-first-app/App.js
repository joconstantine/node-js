const http = require('http');
const handler = require('./Routes');

const server = http.createServer(handler);

server.listen(3000);