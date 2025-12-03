const jwt = require('jsonwebtoken');

function signJwt(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
}

module.exports = {
    signJwt
};
