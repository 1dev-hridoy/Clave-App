const { createValidationError } = require('./errorHandler');

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return str;


    let sanitized = str.replace(/\0/g, '');


    sanitized = sanitized.trim();

    return sanitized;
}

/**
 * Validate that a field exists and is not empty
 */
function validateRequired(value, fieldName) {
    if (value === undefined || value === null) {
        throw createValidationError(`${fieldName} is required`, [fieldName]);
    }

    if (typeof value === 'string' && value.trim().length === 0) {
        throw createValidationError(`${fieldName} cannot be empty`, [fieldName]);
    }

    return true;
}

/**
 * Validate string type and length
 */
function validateString(value, fieldName, options = {}) {
    const { minLength = 0, maxLength = Infinity, required = false } = options;

    if (!required && (value === undefined || value === null)) {
        return true;
    }

    if (required) {
        validateRequired(value, fieldName);
    }

    if (typeof value !== 'string') {
        throw createValidationError(`${fieldName} must be a string`, [fieldName]);
    }

    const sanitized = sanitizeString(value);
    const length = sanitized.length;

    if (length < minLength) {
        throw createValidationError(
            `${fieldName} must be at least ${minLength} characters`,
            [fieldName]
        );
    }

    if (length > maxLength) {
        throw createValidationError(
            `${fieldName} must be at most ${maxLength} characters`,
            [fieldName]
        );
    }

    return true;
}

/**
 * Validate enum value
 */
function validateEnum(value, fieldName, allowedValues, options = {}) {
    const { required = false } = options;

    if (!required && (value === undefined || value === null)) {
        return true;
    }

    if (required) {
        validateRequired(value, fieldName);
    }

    if (value && !allowedValues.includes(value)) {
        throw createValidationError(
            `${fieldName} must be one of: ${allowedValues.join(', ')}`,
            [fieldName]
        );
    }

    return true;
}

/**
 * Validate object structure
 */
function validateObject(value, fieldName, options = {}) {
    const { required = false } = options;

    if (!required && (value === undefined || value === null)) {
        return true;
    }

    if (required) {
        validateRequired(value, fieldName);
    }

    if (value && typeof value !== 'object') {
        throw createValidationError(`${fieldName} must be an object`, [fieldName]);
    }

    if (value && Array.isArray(value)) {
        throw createValidationError(`${fieldName} must be an object, not an array`, [fieldName]);
    }

    return true;
}

/**
 * Chat API validation middleware
 */
const validateChatRequest = (req, res, next) => {
    try {
        const { message, model, systemPrompt } = req.body;

        validateString(message, 'message', {
            required: true,
            minLength: 1,
            maxLength: 10000
        });
        req.body.message = sanitizeString(message);


        if (model) {
            validateEnum(model, 'model', ['gpt-4o', 'gpt-3.5', 'default']);
            req.body.model = sanitizeString(model);
        }


        if (systemPrompt) {
            validateString(systemPrompt, 'systemPrompt', {
                maxLength: 5000
            });
            req.body.systemPrompt = sanitizeString(systemPrompt);
        }

        next();
    } catch (error) {
        next(error);
    }
};



/**
 * Image generation validation middleware
 */
const validateImageRequest = (req, res, next) => {
    try {
        const { prompt, model, style, size } = req.body;


        validateString(prompt, 'prompt', {
            required: true,
            minLength: 1,
            maxLength: 1000
        });
        req.body.prompt = sanitizeString(prompt);


        if (model) {
            validateEnum(model, 'model', ['deepimg', 'flux']);
            req.body.model = sanitizeString(model);
        }

        if (style) {
            validateEnum(style, 'style', ['default', 'anime', 'cyberpunk', 'realistic', 'portrait']);
            req.body.style = sanitizeString(style);
        }


        if (size) {
            validateEnum(size, 'size', ['1:1', '16:9', '9:16', '4:3', '3:4']);
            req.body.size = sanitizeString(size);
        }

        next();
    } catch (error) {
        next(error);
    }
};





const validateSessionId = (req, res, next) => {
    try {
        const sessionId = req.headers['x-session-id'];

        if (sessionId) {

            if (!/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
                throw createValidationError(
                    'Invalid session ID format. Use only alphanumeric characters, hyphens, and underscores.',
                    ['x-session-id']
                );
            }

            if (sessionId.length > 100) {
                throw createValidationError(
                    'Session ID is too long (max 100 characters)',
                    ['x-session-id']
                );
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};




/**
 * JSON body validation - ensure valid JSON
 */
const validateJsonBody = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(createValidationError('Request body is required', ['body']));
        }
    }
    next();
};

module.exports = {
    validateRequired,
    validateString,
    validateEnum,
    validateObject,
    sanitizeString,
    validateChatRequest,
    validateImageRequest,
    validateSessionId,
    validateJsonBody
};
