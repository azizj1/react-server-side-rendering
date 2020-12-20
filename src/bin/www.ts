import app from '../app';
import * as debug from 'debug';
import * as http from 'http';

const DEFAULT_PORT = '4000';
const debugConsole = debug('google-calendar-summary');
const port = normalizePort(process.env.PORT || DEFAULT_PORT);
console.log(`Listening on port ${port}. Visit http://localhost:4000/`);
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val : string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
   * Event listener for HTTP server "error" event.
*/

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
   * Event listener for HTTP server "listening" event.
*/

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr!.port;
    debugConsole('Listening on ' + bind);
}
