'use strict'

const http = require('http');
const app = require('./app.js');
const io = require('./routes/SOCKET_routes');

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

async function bootstrap() {
  return http.createServer(app).listen(port);
}

bootstrap()
  .then(server => {
    io.attach(server, {
      cors: {
        origin: "https://place-wftr.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    console.log(`Server listening at http://${hostname}:${server.address().port}`);
  })
  .catch(error => {
    setImmediate(() => {
      console.error('Server Error:');
      console.error(error);
      process.exit();
    });
  });

