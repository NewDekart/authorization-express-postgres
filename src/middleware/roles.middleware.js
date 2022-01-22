const { getTokenPayloadFromRequest } = require("../utils/auth.utils");

module.exports = function(roles) {

    return function(req, res, next) {

        try {

        const user = req.user || getTokenPayloadFromRequest(req);

        console.log(user)

        const isMethodAllowedForRole = roles.some((role) => user.roles[role]);

        if (!isMethodAllowedForRole) {

            throw new Error();

        }

        next();

        } catch(e) {

            console.log(e);

            res.status(403).send({ message: "User has not access to this method" });

        }

    }

}