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
    selectId: selectId,
    deleteId: deleteId,
    insert: insert,
    update: update
};

/**
 * @param {string} data
 * @param {Function} cb 
 */
async function selectAll(data, cb) {
    const result = await pool.query(`SELECT grupes.id_grupes, grupes.pavadinimas, grupes.ikurimo_data, v.slapyvardis as ikurejas FROM ${tableName} 
    INNER JOIN vartotojai v on grupes.fk_vartotojaiid_vartotojai = v.id_vartotojai`);
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
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} (pavadinimas, fk_vartotojaiid_vartotojai, ikurimo_data) VALUES($1, $2, $3)`,
        [
            values.pavadinimas, values.fk_vartotojaiid_vartotojai,
            values.ikurimo_data
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function update(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`UPDATE ${tableName} SET pavadinimas = $1, fk_vartotojaiid_vartotojai = $2, ikurimo_data = $3 WHERE id_grupes = $4`,
        [
            values.pavadinimas, values.fk_vartotojaiid_vartotojai,
            values.ikurimo_data, values.id_grupes
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}