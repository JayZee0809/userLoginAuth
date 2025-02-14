const EventEmitter = require('events');
const { ReasonPhrases, StatusCodes } = require('http-status-codes');
const logger = require('../../loaders/loggerv2');

class CustomMessage {
    constructor(res) {
        this.response = res;
        this.events = new EventEmitter();
    }

    success(statusCode, message) {
        const { response, events } = this;
        events.once('success', () => response.status(statusCode).json({ ...message }));
        return events.emit('success');
    }

    created(statusCode, message) {
        const { response, events } = this;
        events.once('created', () => response.status(statusCode).json({ ...message }));
        return events.emit('created');
    }

    error(statusCode, message) {
        const { response, events } = this;
        events.once('error', () => response.status(statusCode).json({ ...message }));
        return events.emit('error');
    }
}

const okResponse = (req, res, okMessage) => {
    logger.info(req, `okMessage... ${JSON.stringify(okMessage)}`, okResponse.name);
    return new CustomMessage(res).error(StatusCodes.OK, {
        response: {
            status: ReasonPhrases.OK,
            code: StatusCodes.OK,
            method: req.method,
            message: okMessage
        }
    });
};

const unauthorizedResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, unauthorizedResponse.name);
    return new CustomMessage(res).error(StatusCodes.UNAUTHORIZED, {
        response: {
            status: ReasonPhrases.UNAUTHORIZED,
            code: StatusCodes.UNAUTHORIZED,
            method: req.method,
            message: errMessage
        }
    });
};

const badRequestResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, badRequestResponse.name);
    return new CustomMessage(res).error(StatusCodes.BAD_REQUEST, {
        response: {
            status: ReasonPhrases.BAD_REQUEST,
            code: StatusCodes.BAD_REQUEST,
            method: req.method,
            message: errMessage
        }
    });
};

const paymentRequiredResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, paymentRequiredResponse.name);
    return new CustomMessage(res).error(StatusCodes.PAYMENT_REQUIRED, {
        response: {
            status: ReasonPhrases.PAYMENT_REQUIRED,
            code: StatusCodes.PAYMENT_REQUIRED,
            method: req.method,
            message: errMessage
        }
    });
};

const forbiddenResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, forbiddenResponse.name);
    return new CustomMessage(res).error(StatusCodes.FORBIDDEN, {
        response: {
            status: ReasonPhrases.FORBIDDEN,
            code: StatusCodes.FORBIDDEN,
            method: req.method,
            message: errMessage
        }
    });
};

const notFoundResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, notFoundResponse.name);
    return new CustomMessage(res).error(StatusCodes.NOT_FOUND, {
        response: {
            status: ReasonPhrases.NOT_FOUND,
            code: StatusCodes.NOT_FOUND,
            method: req.method,
            message: errMessage
        }
    });
};

const serviceUnavaliableResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, serviceUnavaliableResponse.name);
    return new CustomMessage(res).error(StatusCodes.SERVICE_UNAVAILABLE, {
        response: {
            status: ReasonPhrases.SERVICE_UNAVAILABLE,
            code: StatusCodes.SERVICE_UNAVAILABLE,
            method: req.method,
            message: errMessage
        }
    });
};
const internalServerErrorResponse = (req, res, errMessage) => {
    logger.info(req, `errMessage... ${JSON.stringify(errMessage)}`, internalServerErrorResponse.name);
    return new CustomMessage(res).error(StatusCodes.INTERNAL_SERVER_ERROR, {
        response: {
            status: ReasonPhrases.INTERNAL_SERVER_ERROR,
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            method: req.method,
            message: errMessage
        }
    });
};

const defaultErrorResponse = (req, res, error) => {
    const errorResponse = error.response;
    if (errorResponse) {
        logger.info(req, `errMessage... ${JSON.stringify(errorResponse)}`, internalServerErrorResponse.name);
        return new CustomMessage(res).error(errorResponse.status, {
            response: {
                status: errorResponse.statusText,
                code: errorResponse.status,
                method: req.method,
                message: errorResponse.data
            }
        });
    }
    return badRequestResponse(req, res, 'Bad Request');
};

module.exports = {
    unauthorizedResponse,
    badRequestResponse,
    okResponse,
    forbiddenResponse,
    notFoundResponse,
    serviceUnavaliableResponse,
    internalServerErrorResponse,
    defaultErrorResponse,
    paymentRequiredResponse
};
