import { pool } from '../server.mjs';
import moment from 'moment';

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
    deleteId: deleteId,
    insert: insert,
    update: update
};

/**
 * Gauna visus vartotojus iš duomenų bazės
 * @param {string} data
 * @param {Function} cb 
 */
async function selectAll(data, cb) {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * Randa vartotoją pagal ID
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_vartotojai = $1`, [ id ]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * Pašalina vartotoją iš duomenų bazės pagal ID
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) return cb(null);

    const result = await pool.query(`DELETE FROM ${tableName} WHERE id_vartotojai = $1`, [ id ]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * Įterpia naują vartotoją į duomenų bazę pagal gautus duomenis iš kliento
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const maxId = await mysql.query(`SELECT MAX(id_vartotojai) as max FROM ${tableName}`);
    if (!maxId) return cb(null);
    const id = maxId[0]['max'];

    values.registracijos_data = moment(values.registracijos_data).utc().format('YYYY-MM-DD HH:MM:SS');
    values.paskutinis_prisijungimas = moment(values.paskutinis_prisijungimas).utc().format('YYYY-MM-DD HH:MM:SS');
    values.balansas = parseFloat(values.balansas);
    values.aktyvuotas = values.aktyvuotas ? 1 : 0;

    const result = await mysql.query(`INSERT INTO ${tableName} VALUES(?)`, 
        [ values.slapyvardis, values.slaptazodis, values.el_pastas,
            values.paskutinis_prisijungimas, values.registracijos_data,
                values.balansas, values.aktyvuotas, id + 1 ]);

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}

/**
 * Atnaujina vartotoją pagal gautus duomenis iš kliento
 * @param {string} values
 * @param {Function} cb 
 */
async function update(values, cb) {
    if (!values) return cb(null);

    values.registracijos_data = moment(values.registracijos_data).utc().format('YYYY-MM-DD HH:MM:SS');
    values.paskutinis_prisijungimas = moment(values.paskutinis_prisijungimas).utc().format('YYYY-MM-DD HH:MM:SS');
    values.balansas = parseFloat(values.balansas);
    values.aktyvuotas = values.aktyvuotas ? 1 : 0;

    const result = await pool.query(`UPDATE ${tableName}
        SET slapyvardis = $1, slaptazodis = $2, el_pastas = $3, paskutinis_prisijungimas = $4,
        registracijos_data = $5, balansas = $6, aktyvuotas = $7 WHERE id_vartotojai = $8`, 
        [
            values.slapyvardis, values.slaptazodis, values.el_pastas,
            values.paskutinis_prisijungimas, values.registracijos_data,
            values.balansas, values.aktyvuotas, values.id_vartotojai 
        ]
    );

    if (result.rowCount === 0) return cb(null);
    cb(result.rows[0]);
}