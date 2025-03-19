const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        // Get token from cookies or Authorization header
        const token = 'a3f1b2c4d5e6f7890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f678'

        console.log("token", token);
        if (!token) {
            return res.status(200).json({
                message: "Please Login...!",
                error: true,
                success: false,
            });
        }

        // Verify token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log("error auth", err);
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        // Attach user ID to the request object
        req.userId = decoded?._id;
        next();
    } catch (err) {
        res.status(401).json({
            message: err.message || "Authentication failed",
            error: true,
            success: false,
        });
    }
}

module.exports = authToken;