const { secretKeys } = require("../../config");
const jwt = require("jsonwebtoken");

function getTokenPayloadFromRequest(req) {

    const token = req.headers.authorization?.split(' ')?.at(1);

        if (!token) {

            throw new Error("Token is not defined");
        }

    const decodedData = jwt.verify(token, secretKeys.token);

    return decodedData;

}

function generateAccessToken (userId, roles) {

    const payload = {
        userId,
        roles
    };

    return jwt.sign(payload, secretKeys.token, { expiresIn: "24h" });

}

module.exports = {
    generateAccessToken,
    getTokenPayloadFromRequest,
}