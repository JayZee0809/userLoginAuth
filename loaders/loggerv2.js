const winston = require('winston');
require('winston-daily-rotate-file');
const httpContext = require('express-http-context');
const errorMessages = require('./customErrorLogs');

let directory;

if (process.platform === 'win32' || process.platform === 'win64') {
    directory = process.env.DIRECTORY_IN_WINDOWS;
} else {
    directory = process.env.DIRECTORY_IN_LINUX;
}

const { combine, timestamp, json } = winston.format;

const formatMessage = (status, serviceName, userId, userName, functionName) => {
    const reqId = httpContext.get('reqId');
    const message = {
        'service-name': serviceName,
        'function-name': functionName,
        user: {
            id: userId,
            name: userName
        },
        message: status
    };
    return reqId ? { ...message, reqId } : message;
};

const errorFormat = (serviceName, errorCause, userId, userName, functionName, errorMessage, code) => {
    const reqId = httpContext.get('reqId');
    const message = {
        'service-name': serviceName,
        'function-name': functionName,
        user: {
            id: userId,
            name: userName
        },
        error_cause: errorCause,
        error_message: errorMessage,
        code
    };
    return reqId ? { ...message, reqId } : message;
};

const infoFormat = (serviceName, infoMessage, userId, userName, functionName) => {
    const reqId = httpContext.get('reqId');
    const message = {
        'service-name': serviceName,
        'function-name': functionName,
        user: {
            id: userId,
            name: userName
        },
        message: infoMessage
    };
    return reqId ? { ...message, reqId } : message;
};

const debugFormat = (serviceName, data, userId, userName, functionName) => {
    const reqId = httpContext.get('reqId');
    const message = {
        'service-name': serviceName,
        'function-name': functionName,
        user: {
            id: userId,
            name: userName
        },
        data
    };
    return reqId ? { ...message, reqId } : message;
};

const createTransport = (level) => {
    const fileRotateTransport = new winston.transports.DailyRotateFile({
        filename: `${directory}/${level}/%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level,
        maxSize: '20m'
    });
    return fileRotateTransport;
};

const winstonLoggerInfo = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        json()
    ),
    transports: [createTransport('info')]
});

const winstonLoggerError = winston.createLogger({
    level: 'error',
    format: combine(
        timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        json()
    ),
    transports: [createTransport('error')]
});

const winstonLoggerDebug = winston.createLogger({
    level: 'debug',
    format: combine(
        timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        json()
    ),
    transports: [createTransport('debug')]
});

const logger = {
    log: (level, ...args) => {
        const message = args.join(' ');
        winstonLoggerInfo.log(level, formatMessage(message));
    },
    methodStart: (req, functionName, service_name) => {
        const status = 'Method is Started';
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        winstonLoggerInfo.info(formatMessage(status, serviceName, userId, userName, functionName));
    },
    serviceStart: (req, functionName, service_name) => {
        const status = 'Service is Started';
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        winstonLoggerInfo.info(formatMessage(status, serviceName, userId, userName, functionName));
    },
    error: (req, error, functionName, code, service_name) => {
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        const errorCause = error;
        const errorMessage = errorMessages.statusMessage[code];

        winstonLoggerError.error(
            errorFormat(serviceName, errorCause, userId, userName, functionName, errorMessage, code)
        );
    },
    warn: (...args) => {
        const message = args;
        winstonLoggerInfo.warn(message);
    },
    info: (req, message, functionName, service_name = '') => {
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        winstonLoggerInfo.info(infoFormat(serviceName, message, userId, userName, functionName));
    },
    debug: (req, functionName, data, service_name) => {
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        winstonLoggerDebug.debug(debugFormat(serviceName, data, userId, userName, functionName));
    },
    serviceEnd: (req, functionName, service_name) => {
        const status = 'Service is Ended';
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        winstonLoggerInfo.info(formatMessage(status, serviceName, userId, userName, functionName));
    },
    methodEnd: (req, functionName, service_name) => {
        const status = 'Method is Ended';
        let serviceName;
        let userId;
        let userName;
        if (Object.keys(req).length > 0) {
            if (req.originalUrl) {
                serviceName = req.originalUrl;
            } else {
                serviceName = 'Unknown';
            }
            if (req.user) {
                userId = req.user.user_id;
                userName = req.user.email;
            }
            if (req.subscriber) {
                userId = req.subscriber.subscriber_id;
                userName = req.subscriber.email;
            } else {
                userId = 'Unknown';
                userName = 'Unknown';
            }
        } else {
            serviceName = service_name;
            userId = 'Unknown';
            userName = 'Unknown';
        }
        winstonLoggerInfo.info(formatMessage(status, serviceName, userId, userName, functionName));
    }
};

module.exports = logger;
