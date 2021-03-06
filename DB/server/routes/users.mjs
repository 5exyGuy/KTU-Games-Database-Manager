import {
    pool
} from '../server.mjs';
import bcrypt from 'bcrypt';

const tableName = 'vartotojai'; // Lentelės pavadinimas

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
    selectReviews: selectReviews,
    deleteId: deleteId,
    insert: insert,
    update: update
};

/**
 * @param {string} data
 * @param {Function} cb 
 */
async function selectAll(data, cb) {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_vartotojai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

async function selectReviews(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName}
        INNER JOIN atsiliepimai a on vartotojai.id_vartotojai = a.fk_vartotojaiid_vartotojai
    WHERE id_vartotojai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_vartotojai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_vartotojai`,
        [
            values.slapyvardis, values.slaptazodis, values.el_pastas,
            values.paskutinis_prisijungimas, values.registracijos_data,
            values.balansas, values.aktyvuotas
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function update(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`UPDATE ${tableName} SET slapyvardis = $1, slaptazodis = $2, el_pastas = $3, paskutinis_prisijungimas = $4, registracijos_data = $5, balansas = $6, aktyvuotas = $7 WHERE id_vartotojai = $8`,
        [
            values.slapyvardis, values.slaptazodis, values.el_pastas,
            values.paskutinis_prisijungimas, values.registracijos_data,
            values.balansas, values.aktyvuotas, values.id_vartotojai
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}