const jwt = require('jsonwebtoken');



/**
 * Middleware to authenticate requests using JWT.
 * 
 * Extracts the token from the Authorization header, verifies it,
 * and attaches the decoded user ID to the request object.
 * 
 */

 function authenticate(req, res, next){
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token){
        res.status(401).send("Access Denied");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {id: decoded.userId}; 
        next()
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}


module.exports = authenticate
