import { pool } from '../server.mjs';

const tableName = 'zaidimai'; // Lentelės pavadinimas

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
    const result = await pool.query(`SELECT zaidimai.id_zaidimai, zaidimai.pavadinimas, zaidimai.platforma, k.pavadinimas as kurejas, zaidimai.kaina FROM zaidimai
    INNER JOIN kurejai k on zaidimai.fk_kurejaiid_kurejai = k.id_kurejai`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_zaidimai = $1`, [ id ]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_zaidimai = $1`, [ id ]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} (pavadinimas, isleidimo_data, kaina, varikliukas, zanras, rezimas, platforma, fk_kurejaiid_kurejai) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, 
        [ 
            values.pavadinimas, values.isleidimo_data, values.kaina,
            values.varikliukas, values.zanras, values.rezimas, values.platforma,
            values.fk_kurejaiid_kurejai
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
    console.log(values);
    if (!values) return cb(null);

    const result = await pool.query(`UPDATE ${tableName} SET pavadinimas = $1, isleidimo_data = $2, kaina = $3, 
    varikliukas = $4, zanras = $5, rezimas = $6, platforma = $7, fk_kurejaiid_kurejai = $8 WHERE id_zaidimai = $9`, 
    [ 
        values.pavadinimas, values.isleidimo_data, values.kaina,
        values.varikliukas, values.zanras, values.rezimas, 
        values.platforma, values.fk_kurejaiid_kurejai,
        values.id_zaidimai
    ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}