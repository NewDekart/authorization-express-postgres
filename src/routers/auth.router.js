const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { check } =  require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const rolesMiddleware = require("../middleware/roles.middleware");

const router = Router();

router.post(
    "/registration",
    [
        check('username', 'Username should not be empty').notEmpty(),
        check('password', 'Password length shoud be between 4 and 10').isLength({ min: 4, max: 10 }),
    ],
    authController.registration
);

router.post("/login", [
    check('username', 'Username should not be empty').notEmpty(),
], authController.login);

router.get("/users", [
    authMiddleware,
    rolesMiddleware([ 'ADMIN' ])
], authController.getUsers);

module.exports = router;