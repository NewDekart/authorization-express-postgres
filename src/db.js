const Pool = require("pg").Pool;
const credentials = require("../config");

const pool = new Pool({
    ...credentials.db,
});

module.exports = pool;