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
    selectGroupUsers: selectGroupUsers,
    selectId: selectId,
    deleteId: deleteId,
    deleteUser: deleteUser,
    insert: insert,
    update: update
};

/**
 * @param {string} data
 * @param {Function} cb 
 */
async function selectAll(data, cb) {
    const result = await pool.query(`SELECT pasiekimai.id_pasiekimai, pasiekimai.pavadinimas, pasiekimai.taskai, z.pavadinimas as zaidimas, z.platforma FROM ${tableName}
    INNER JOIN zaidimai z on pasiekimai.fk_zaidimaiid_zaidimai = z.id_zaidimai`);
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}

/**
 * @param {string} data
 * @param {Function} cb 
 */
async function selectGroupUsers(id, cb) {
    const result = await pool.query(`SELECt * FROM vartotojai
        INNER JOIN vartotoju_grupes vg on vartotojai.id_vartotojai = vg.fk_vartotojaiid_vartotojai
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
 * @param {any} data
 * @param {Function} cb 
 */
async function deleteUser(data, cb) {
    if (!data) return cb(null);

    const result = await pool.query(`DELETE FROM vartotoju_grupes WHERE fk_grupesid_grupes = $1 AND fk_vartotojaiid_vartotojai = $2`, [data.groupId, data.userId]);

    if (result.rowCount === 0) return cb(null);
    cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) return cb(null);

    const result = await pool.query(`INSERT INTO ${tableName} (pavadinimas, fk_vartotojaiid_vartotojai, ikurimo_data) VALUES($1, $2, $3) RETURNING id_grupes`,
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