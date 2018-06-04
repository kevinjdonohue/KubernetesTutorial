let http = require('http');

let handleRequest = (request, response) => {
  console.log(`Received request for URL: ${request.url}`);
  response.writeHead(200);
  response.end('HelloWorld');
};

let www = http.createServer(handleRequest);

www.listen(8080);

console.log('HelloWorld Node server started up successfully at http://localhost:8080');
