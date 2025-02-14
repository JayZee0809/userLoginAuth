'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const debug = require('debug')('auth:server');
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

const uuid = require('uuid');
const httpContext = require('express-http-context');

const userManagementAndAuthentication = require('./user-management/routes');
const connectMongo = require('./config/dbConnect');

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < 2; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    connectMongo();
    const app = express();

    app.use(
        helmet({
            crossOriginResourcePolicy: false
        })
    );

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cors());

    app.use(httpContext.middleware);

    app.use('/public', express.static(path.join(__dirname, '/public')));

    app.use(function (req, res, next) {
        httpContext.set('reqId', uuid.v1());
        res.header('X-XSS-Protection', '1; mode=block');
        res.header('X-Frame-Options', 'deny');
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE , HEAD , OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept,Authorization, X-Token'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
    });

    /**
     * Get port from environment and store in Express.
     */
    const port = process.env.SERVER_PORT || 4000;

    app.use('/api', userManagementAndAuthentication);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Event listener for HTTP server 'error' event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);

            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);

            default:
                throw error;
        }
    }

    function onListening() {
        const addr = server.address();
        console.info(`The server has started on port: ${process.env.SERVER_PORT}`);
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}
