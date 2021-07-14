const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; //get the token value after the whitespace
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, jwtSecret);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();;
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};