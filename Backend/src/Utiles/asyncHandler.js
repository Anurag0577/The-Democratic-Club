/*
MUST REMEMBER THESE THING
~ fn is yor api route function
~ the function we are returning from the higher order function act as a wrapper 
*/

const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export {asyncHandler}