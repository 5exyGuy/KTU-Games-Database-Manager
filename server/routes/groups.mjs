import {
    pool
} from '../server.mjs';

const tableName = 'grupes'; // Lentelės pavadinimas

/**
 * @param {string} routeName 
 * @param {any} data 
 * @param {Function} cb 
 */
export function route(routeName, data, cb) {
    const fn = routes[routeName];
    if (!fn) return;
    fn(data, cb);
}

const routes = {
    selectAll: selectAll,
    selectUsers: selectUsers,
    selectId: selectId,
    deleteId: deleteId,
    deleteUser: deleteUser,
    insert: insert,
    insertUser: insertUser,
    update: update,
    updateUser: updateUser
};

/**
 * @param {any} data
 * @param {Function} cb 
 */
async function selectAll(data, cb) {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {any} id
 * @param {Function} cb 
 */
async function selectUsers(id, cb) {
    const result = await pool.query(`SELECT * FROM vartotoju_grupes 
        INNER JOIN vartotojai v on vartotoju_grupes.fk_vartotojaiid_vartotojai = v.id_vartotojai
    WHERE fk_grupesid_grupes = $1`, [id]);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_grupes = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_grupes = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {number} data
 * @param {Function} cb 
 */
async function deleteUser(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM vartotoju_grupes WHERE id_vartotoju_grupes = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} (pavadinimas) VALUES ($1) RETURNING id_grupes`, [values.pavadinimas]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function insertUser(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO vartotoju_grupes (fk_grupesid_grupes, fk_vartotojaiid_vartotojai, pareigos) VALUES ($1, $2, $3)`,
        [
            values.fk_grupesid_grupes, values.fk_vartotojaiid_vartotojai,
            values.pareigos
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function update(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`UPDATE ${tableName} SET pavadinimas = $1 WHERE id_grupes = $2`, [values.pavadinimas, values.id_grupes]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function updateUser(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`UPDATE vartotoju_grupes SET fk_grupesid_grupes = $1, fk_vartotojaiid_vartotojai = $2, pareigos = $3 WHERE id_vartotoju_grupes = $4`,
        [
            values.fk_grupesid_grupes, values.fk_vartotojaiid_vartotojai,
            values.pareigos, values.id_vartotoju_grupes
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}