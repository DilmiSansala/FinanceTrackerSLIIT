const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1];

    if (!token) {
        res.status(401);
        throw new Error("No token provided");
    }

    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401);
            throw new Error("Invalid or expired token");
        } else {
            return decoded;
        }
    });

    if (verifyToken) {
        // Save the user ID in the request object
        req.user = verifyToken.id;
        next();
    } else {
        res.status(401);
        throw new Error("Unauthorized");
    }
};

module.exports = isAuthenticated;