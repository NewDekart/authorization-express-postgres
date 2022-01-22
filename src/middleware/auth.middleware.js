const { getTokenPayloadFromRequest } = require("../utils/auth.utils");

module.exports = function(req, res, next) {

    if (req.method === "OPTIONS") {

        next();

    }

    try {

        const decodedData = getTokenPayloadFromRequest(req);

        req.user = decodedData;

        next();

    } catch(e) {

        console.log(e);

        return res.status(403).json({ message: "User is not authorized" });

    }

}