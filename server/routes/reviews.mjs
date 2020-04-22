import {
    pool
} from '../server.mjs';
import moment from 'moment';

const tableName = 'atsiliepimai'; // Lentelės pavadinimas

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
    const result = await pool.query(`SELECT atsiliepimai.id_atsiliepimai, atsiliepimai.ivertinimas, atsiliepimai.data,
    v.slapyvardis as vartotojas, z.pavadinimas as zaidimas FROM ${tableName}
        INNER JOIN vartotojai v on atsiliepimai.fk_vartotojaiid_vartotojai = v.id_vartotojai
        INNER JOIN zaidimai z on atsiliepimai.fk_zaidimaiid_zaidimai = z.id_zaidimai`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_atsiliepimai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_atsiliepimai = $1`, [id]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} VALUES($1, $2, $3, $4, $5)`,
        [
            values.ivertinimas, values.komentaras, values.data,
            values.fk_zaidimaiid_zaidimai, values.fk_vartotojaiid_vartotojai
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

    const result = await pool.query(`UPDATE mokejimai SET ivertinimas = $1, komentaras = $2, data = $3, fk_uzsakymaiid_uzsakymai = $4, fk_vartotojaiid_vartotojai = $5 WHERE id_atsiliepimai = $6`,
        [
            values.ivertinimas, values.komentaras, values.data,
            values.fk_zaidimaiid_zaidimai, values.fk_vartotojaiid_vartotojai,
            values.id_atsiliepimai
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(true);
}