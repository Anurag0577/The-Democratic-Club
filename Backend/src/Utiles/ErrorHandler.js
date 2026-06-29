class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong!',
        errors = [],
        stack = ''
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        Object.defineProperty(this, 'message', {
            value: message,
            enumerable: true, 
            writable: true,
            configurable: true
        });
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }