/**
 * Secure Request Logger Middleware


 * security leaks in production logs.
 */

const SENSITIVE_HEADERS = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'api-key',
    'x-auth-token',
    'auth-token',
    'x-csrf-token',
    'password',
    'secret'
];


const SENSITIVE_BODY_FIELDS = [
    'password',
    'token',
    'apiKey',
    'api_key',
    'secret',
    'secretKey',
    'secret_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'creditCard',
    'credit_card',
    'ssn',
    'socialSecurityNumber'
];




function sanitizeHeaders(headers) {
    if (!headers) return {};

    const sanitized = {};
    for (const [key, value] of Object.entries(headers)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_HEADERS.some(sensitive => lowerKey.includes(sensitive))) {
            sanitized[key] = '[REDACTED]';
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}



function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();


        if (SENSITIVE_BODY_FIELDS.some(sensitive => lowerKey.includes(sensitive))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {

            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}




/**
 * Get logging level from environment
 */
function getLogLevel() {
    const env = process.env.NODE_ENV || 'development';
    const level = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');
    return level;
}



const logger = (req, res, next) => {
    const logLevel = getLogLevel();
    const timestamp = new Date().toISOString();


    console.log(`[${timestamp}] ${req.method} ${req.url}`);


    if (logLevel === 'debug') {
        const sanitizedHeaders = sanitizeHeaders(req.headers);
        console.log('Headers:', sanitizedHeaders);
    }


    if (logLevel === 'debug' && req.body) {
        const sanitizedBody = sanitizeObject(req.body);
        console.log('Body:', sanitizedBody);
    }


    res.on('finish', () => {
        const duration = Date.now() - req._startTime;
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });


    req._startTime = Date.now();

    next();
};

module.exports = logger;
