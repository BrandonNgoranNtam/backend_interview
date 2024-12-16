const jwt = require('jsonwebtoken');



 function authenticate(req, res, next){
    console.log("")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token){
        res.status(401).send("Access Denied");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded",decoded)
        req.user = {id: decoded.userId}; 
        next()
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}


module.exports = authenticate
