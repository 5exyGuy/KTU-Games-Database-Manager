import {
    pool
} from '../server.mjs';

const tableName = 'mokejimai'; // Lentelės pavadinimas

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
    const result = await pool.query(`SELECT mokejimai.id_mokejimai, v.slapyvardis as moketojas, u.id_uzsakymai as uzsakymas, mokejimai.data, mokejimai.kaina FROM ${tableName}
    INNER JOIN uzsakymai u on mokejimai.fk_uzsakymaiid_uzsakymai = u.id_uzsakymai
    INNER JOIN vartotojai v on mokejimai.fk_vartotojaiid_vartotojai = v.id_vartotojai`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_mokejimai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_mokejimai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} (tipas, kaina, data, fk_uzsakymaiid_uzsakymai, fk_vartotojaiid_vartotojai) VALUES($1, $2, $3, $4, $5)`,
        [
            values.tipas, values.kaina, values.data,
            values.fk_uzsakymaiid_uzsakymai, values.fk_vartotojaiid_vartotojai
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

    const result = await pool.query(`UPDATE ${tableName} SET tipas = $1, kaina = $2, data = $3, fk_uzsakymaiid_uzsakymai = $4, fk_vartotojaiid_vartotojai = $5 WHERE id_mokejimai = $6`,
        [
            values.tipas, values.kaina, values.data,
            values.fk_uzsakymaiid_uzsakymai, values.fk_vartotojaiid_vartotojai,
            values.id_mokejimai
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}