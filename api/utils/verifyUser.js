import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGQzNzU4MTE2YjBjZjMzMDU5ODgzMCIsImlhdCI6MTc0MjU4Mzg2MH0.sNH_lpwo0TFg76XbdF_Zp-5lWMED9A9f8Z3evxCIgf8';

    if (!token) {
        return next(errorHandler(401, "Unauthorized: No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Differentiate between token verification errors
            const message = err.name === 'TokenExpiredError' 
                ? "Session expired" 
                : "Invalid token";
            return next(errorHandler(403, `Forbidden: ${message}`));
        }
        
        req.user = user;
        next();
    });
};