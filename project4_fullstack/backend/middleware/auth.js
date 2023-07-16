const jwt = require("jsonwebtoken");

//this is to be implmented not in the register/login flow but in other part of the app not requiring user.js
// middlewares serves as a series of functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle, 
// denoted by a variable, typically named next. 
// Middleware functions can execute any code, make changes to the request and response objects, end the request-response cycle, 
// and call the next function in the stack.
const verify = (req, res, next) => {
    //3 methods to pass the token
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token) { //403 means forbidden
        return res.status(403).send("A token is required for authentication");
    }
    try {
        //decode the token using the secret key associated with jwt and bcrypt
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        // In case of failing to detect the token
        return res.status(401).send("Invalid Token");
    }
    // This is useful if you have a series of middleware, the next() function passes the request to the next middleware
    return next();
}

module.exports = verify;