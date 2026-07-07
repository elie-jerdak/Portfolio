module.exports = (err, req, res, next) => {

    console.error({
        name: err.name,
        message: err.message,
        code: err.code,
        meta: err.meta,
        stack: err.stack
    });

    res.status(err.status || 500).json({
        success: false,
        error: {
            name: err.name,
            message: err.message,
            code: err.code,
            meta: err.meta,
            stack:
                process.env.NODE_ENV === "development"
                    ? err.stack
                    : undefined
        }
    });
};