const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.status = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1]; //get the token value after the whitespace
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, jwtSecret);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.status = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
};