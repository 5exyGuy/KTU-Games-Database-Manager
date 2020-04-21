import { pool } from '../server.mjs';

const tableName = 'uzsakymai'; // Lentelės pavadinimas

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
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

// SELECT uzsakymai.id_uzsakymai,
//         v.slapyvardis as uzsakovas,
//         uzsakymai.data,
//         uzsakymai.busena,
//         (SELECT SUM(kiekis) as kiekis FROM zaidimu_uzsakymai WHERE fk_uzsakymaiid_uzsakymai = uzsakymai.id_uzsakymai),
//         uzsakymai.kaina
//     FROM uzsakymai INNER JOIN vartotojai v on uzsakymai.fk_vartotojaiid_vartotojai = v.id_vartotojai

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_uzsakymai = $1`, [ id ]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_uzsakymai = $1`, [ id ]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} VALUES($1, $2, $3)`, 
        [ values.pavadinimas, values.logotipas, values.hipersaitas ]
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

    const result = await pool.query(`UPDATE ${tableName} SET pavadinimas = $1, logotipas = $2, hipersaitas = $3 WHERE id_uzsakymai = $4`, 
        [ values.pavadinimas, values.logotipas, values.hipersaitas, values.id_kurejai ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}