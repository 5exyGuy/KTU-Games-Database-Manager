import {
    pool
} from '../server.mjs';

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
    selectTable: selectTable,
    selectAll: selectAll,
    selectId: selectId,
    selectGames: selectGames,
    deleteId: deleteId,
    deleteGame: deleteGame,
    insert: insert,
    insertGame: insertGame,
    update: update
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
 * @param {any} data
 * @param {Function} cb 
 */
async function selectTable(data, cb) {
    const result = await pool.query(`SELECT uzsakymai.id_uzsakymai,
        v.slapyvardis as uzsakovas,
        uzsakymai.data,
        uzsakymai.busena,
        (SELECT SUM(kiekis) as kiekis FROM zaidimu_uzsakymai WHERE fk_uzsakymaiid_uzsakymai = uzsakymai.id_uzsakymai),
        uzsakymai.kaina
    FROM ${tableName} INNER JOIN vartotojai v on uzsakymai.fk_vartotojaiid_vartotojai = v.id_vartotojai`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {any} data
 * @param {Function} cb 
 */
async function selectGames(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName}
        INNER JOIN zaidimu_uzsakymai zu on uzsakymai.id_uzsakymai = zu.fk_uzsakymaiid_uzsakymai
    WHERE id_uzsakymai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_uzsakymai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_uzsakymai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteGame(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM zaidimu_uzsakymai WHERE id_zaidimu_uzsakymai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} (data, busena, kaina, pvm, fk_vartotojaiid_vartotojai) VALUES($1, $2, $3, $4, $5) RETURNING id_uzsakymai`,
        [values.data, values.busena, values.kaina, values.pvm, values.fk_vartotojaiid_vartotojai]
    );

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function insertGame(values, cb) {
    console.log(values);
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO zaidimu_uzsakymai (fk_zaidimaiid_zaidimai, fk_uzsakymaiid_uzsakymai, kiekis) VALUES($1, $2, $3) RETURNING id_zaidimu_uzsakymai`,
        [values.fk_zaidimaiid_zaidimai, values.fk_uzsakymaiid_uzsakymai, values.kiekis]
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

    const result = await pool.query(`UPDATE ${tableName} SET data = $1, busena = $2, kaina = $3, pvm = $4, fk_vartotojaiid_vartotojai = $5 WHERE id_uzsakymai = $6`,
        [values.data, values.busena, values.kaina, values.pvm, values.fk_vartotojaiid_vartotojai, values.id_uzsakymai]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {any} values
 * @param {Function} cb 
 */
async function updateGame(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`UPDATE zaidimu_uzsakymai SET fk_zaidimaiid_zaidimai = $1, fk_uzsakymaiid_uzsakymai = $2, kiekis = $3 WHERE id_uzsakymai = $4`,
        [values.fk_zaidimaiid_zaidimai, values.fk_uzsakymaiid_uzsakymai, values.kiekis, values.id_uzsakymai]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}