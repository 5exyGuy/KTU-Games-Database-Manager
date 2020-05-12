import {
	pool
} from '../server.mjs';

const tableName = 'nuotraukos'; // Lentelės pavadinimas

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
	const result = await pool.query(`SELECT nuotraukos.id_nuotraukos, nuotraukos.nuoroda, z.pavadinimas as zaidimas FROM ${tableName} 
    INNER JOIN zaidimai z on nuotraukos.fk_zaidimaiid_zaidimai = z.id_zaidimai`);
	if (result.rowCount === 0) return cb(null);
	cb(result.rows);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
	if (!id) return cb(null);

	const result = await pool.query(`SELECT * FROM ${tableName} WHERE id_nuotraukos = $1`, [id]);

	if (result.rowCount === 0) return cb(null);
	cb(result.rows[0]);
}

/**
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
	if (!id) return cb(null);

	const result = await pool.query(`DELETE FROM ${tableName} WHERE id_nuotraukos = $1`, [id]);

	if (result.rowCount === 0) return cb(null);
	cb(true);
}

/**
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
	if (!values) return cb(null);

	const result = await pool.query(`INSERT INTO ${tableName} (nuoroda, fk_zaidimaiid_zaidimai) VALUES ($1, $2)`,
		[
			values.nuoroda, values.fk_zaidimaiid_zaidimai
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

	const result = await pool.query(`UPDATE ${tableName} SET nuoroda = $1, fk_zaidimaiid_zaidimai = $2 WHERE id_nuotraukos = $3`,
		[
			values.nuoroda, values.fk_zaidimaiid_zaidimai,
			values.id_nuotraukos
		]
	);

	if (result.rowCount === 0) return cb(null);
	cb(true);
}