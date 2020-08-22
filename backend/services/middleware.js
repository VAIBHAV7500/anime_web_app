const anyError = (req, res, next) => {
    const error = new Error(`${req.originalUrl} not found!!!`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.ENV === 'dev' ? err : {};
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message
    });
}

module.exports = {
    anyError,
    errorHandler,
}