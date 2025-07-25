const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

const fetchUser = (req, res, next) => {
    // get the user from the jwt token and id to req objectPosition: 
    const token = req.header('Authorization');
    if (!token) {
        return res.status(400).send("Access denied" )
    }
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET environment variable is not set");
            return res.status(500).send("Server configuration error");
        }
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(400).send("Access denied")
    }


}

module.exports = fetchUser