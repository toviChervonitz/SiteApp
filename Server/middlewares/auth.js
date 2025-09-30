const jwt = require('jsonwebtoken');
const { config } = require('../config/secret');

exports.auth = (req, res, next) => {
    let token = req.header('x-api-key');
    if (!token) {
        return res.status(401).json({ mas: "You need to send token to this endpoint url 666666" })
    }
    try {
        let tokenData = jwt.verify(token, config.tokenSecret);
        req.tokenData = tokenData;
        next();
    }
    catch (err) {
        return res.status(401).json({ mas: "Token invalid or expired 666666", err })
    }
}

exports.authAdmin = (req, res, next) => {
    let token = req.header('x-api-key');
    if (!token) {
        return res.status(401).json({ mas: "You need to send token to this endpoint url 666666" })
    }
    try {
        let tokenData = jwt.verify(token, config.tokenSecret);
        if (tokenData.role != "admin") {
            return res.status(403).json({ mas: "Token invalid or expired", code: "6A" });
        }
        req.tokenData = tokenData;
        next();
    }
    catch (err) {
        return res.status(401).json({ mas: "Token invalid or expired 666666", err })
    }
}

