const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Please authenticate' });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.userId = decoded.userId;
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = authenticateToken; 