/**
 * Custom Error class for API errors
 */
class APIError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
}




/**
 * Error logger
 * Logs errors to console with different levels based on severity
 */
function logError(error, req) {
    const timestamp = new Date().toISOString();
    const logLevel = error.statusCode >= 500 ? 'ERROR' : 'WARN';

    console.error(`[${timestamp}] [${logLevel}] ${error.name}: ${error.message}`);
    console.error(`Request: ${req.method} ${req.url}`);

    if (error.details) {
        console.error(`Details: ${JSON.stringify(error.details)}`);
    }


    if (error.statusCode >= 500 && error.stack) {
        console.error(`Stack trace:\n${error.stack}`);
    }
}


function shouldExposeDetails(statusCode) {
    const env = process.env.NODE_ENV || 'development';


    if (env === 'production') {
        return statusCode >= 400 && statusCode < 500;
    }


    return true;
}

/**
 * Global error handler middleware
 * Must be registered AFTER all routes
 */
const errorHandler = (err, req, res, next) => {


    let error = err;




    if (!(err instanceof APIError)) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        error = new APIError(message, statusCode);
        error.stack = err.stack;
    }

    logError(error, req);


    const acceptHeader = req.headers.accept || '';
    const isApiRequest = req.path.startsWith('/api/') || acceptHeader.includes('application/json');

    if (isApiRequest) {

        const response = {
            error: error.message,
            timestamp: error.timestamp
        };


        if (shouldExposeDetails(error.statusCode)) {
            if (error.details) {
                response.details = error.details;
            }


            if (process.env.NODE_ENV === 'development' && error.stack) {
                response.stack = error.stack.split('\n');
            }
        }


        return res.status(error.statusCode).json(response);
    }


    const webConfig = require('../config/webConfig.json');


    if (error.statusCode === 404) {
        return res.status(404).render('404', { webConfig });
    } else {

        return res.status(500).render('500', {
            webConfig,
            error: process.env.NODE_ENV === 'development' ? error : null
        });
    }
};





/**
 * 404 Not Found handler
 * Handles routes that don't exist
 */
const notFoundHandler = (req, res, next) => {

    const acceptHeader = req.headers.accept || '';
    const isApiRequest = req.path.startsWith('/api/') || acceptHeader.includes('application/json');


    if (isApiRequest) {
        const error = new APIError(
            `Route not found: ${req.method} ${req.url}`,
            404,
            { path: req.url, method: req.method }
        );
        return next(error);
    }

    // For web requests   render 404 page
    const webConfig = require('../config/webConfig.json');
    res.status(404).render('404', { webConfig });
};


const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};




function createValidationError(message, invalidFields = []) {
    return new APIError(
        message,
        400,
        { invalidFields }
    );
}





function createServiceError(service, originalError) {
    return new APIError(
        `${service} service temporarily unavailable`,
        503,
        { service, reason: originalError.message }
    );
}

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    APIError,
    createValidationError,
    createServiceError
};