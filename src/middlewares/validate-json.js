const validateJSON = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const formattedError = {
          status: err.statusCode,
          msg: err.message
        }
        return res.status(err.statusCode).json(formattedError); // Bad request
    }
    next();
}
 
module.exports = {
    validateJSON
}