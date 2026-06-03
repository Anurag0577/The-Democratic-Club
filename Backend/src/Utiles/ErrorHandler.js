class ApiError extends Error{
    constructor(
        statusCode,
        message = 'Something went wrong!',
        errors = [],
        stack = ''
    ){

        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.success = false

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); // we are telling node, "Hey, look at the exact file and line where this error was thrown right now, record the whole history of how we got here, and save that map inside this.stack."
        }
    }
}

export {ApiError}
