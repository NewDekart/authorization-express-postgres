const bcrypt = require("bcryptjs");
const pool = require("../db");
const { validationResult } = require("express-validator");
const { generateAccessToken } = require("../utils/auth.utils");

class AuthController {

    async registration(req, res) {

        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).send({ message: 'Validation Error', errors });

            }

            const { username, password } = req.body;

            const queryUserByUsername = await pool.query(
                'SELECT user_id FROM users WHERE username = $1',
                [ username ]
            )

            if (queryUserByUsername.rowCount > 0) {

                return res.status(400).send({ message: 'User with the same username already exists' });

            }

            const queryUserRoleId = await pool.query(
                'SELECT role_id FROM roles WHERE name = $1',
                [ 'USER' ]
            )

            const roleId = queryUserRoleId.rows?.at(0)["role_id"];

            const hashPassword = await bcrypt.hash(password, 7);

            try {

                await pool.query('BEGIN');

                const insertUserData = await pool.query(
                    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
                    [ username, hashPassword ]
                )

                const insertedUserId = insertUserData.rows?.at(0)?.user_id

                await pool.query(
                    'INSERT INTO users_to_roles VALUES ($1, $2)',
                    [ insertedUserId, roleId ]
                )

                await pool.query('COMMIT');

                res.send({ user_id: insertedUserId });

            } catch(e) {

                await pool.query('ROLLBACK');

                throw(e);

            }
            

        } catch (e) {

            console.log(e);

            res.status(400).send({ message: 'Registrarion error' });

        }

    }

    async login(req, res) {

        try {

            const errors = validationResult(req);;

            if (!errors.isEmpty()) {

                return res.status(400).send({ message: 'Validation Error', errors });

            }

            const { username, password } = req.body

            const queryUserByUsername = await pool.query(
                'SELECT * FROM users WHERE username = $1',
                [ username ]
            );

            if (queryUserByUsername.rowCount === 0) {

                return res.status(400).send({ message: `User with this username does not exist` });

            }

            const user = queryUserByUsername.rows.at(0);

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {

                return res.status(400).send({ message: "Wrong password" });

            };

            const queryUserRolesByUserId = await pool.query(
                'SELECT roles.name FROM users JOIN users_to_roles USING (user_id) JOIN roles USING (role_id) WHERE users.user_id = $1',
                [ user.user_id ]
            );

            const userRoles = queryUserRolesByUserId.rows
                .reduce((acc, row) => {

                    return {

                        ...acc,
                        [row.name]: true,

                    }

                }, {});

            const token = generateAccessToken(user.user_id, userRoles);

            return res.send({ token });

        } catch (e) {

            console.log(e)

            res.status(400).send({ message: 'Login error' })

        }

    }

    async getUsers(_, res, next) {

        try {

            const queryUsers = await pool.query('SELECT user_id, username FROM users');

            res.send(queryUsers.rows);

        } catch (e) {

            next(e);

        }

    }

}

module.exports = new AuthController();