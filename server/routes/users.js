const pool = require('../index');
const moment = require('moment');

const tableName = 'vartotojai'; // Lentelės pavadinimas

exports.route = function route(routeName, data, cb) {
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
    pool.query(`SELECT * FROM ${tableName}`, (error, result) => {
        if (!error) return cb(null);
        cb(result.rows);
    });
}

/**
 * Randa vartotoją pagal ID
 * @param {number} id
 * @param {Function} cb 
 */
async function selectId(id, cb) {
    if (!id) { cb(null); return; }

    const result = await mysql.query(`SELECT * FROM ${tableName} WHERE id_vartotojai = ?`, [ id ]);

    if (!result) { cb(null); return; }
    cb(result);
}

/**
 * Pašalina vartotoją iš duomenų bazės pagal ID
 * @param {number} id
 * @param {Function} cb 
 */
async function deleteId(id, cb) {
    if (!id) { cb(null); return; }

    const result = await mysql.query(`DELETE FROM ${tableName} WHERE id_vartotojai = ?`, [ id ]);

    if (!result) { cb(null); return; }
    cb(result);
}

/**
 * Įterpia naują vartotoją į duomenų bazę pagal gautus duomenis iš kliento
 * @param {string} values
 * @param {Function} cb 
 */
async function insert(values, cb) {
    if (!values) { cb(null); return; }

    const maxId = await mysql.query(`SELECT MAX(id_vartotojai) FROM ${tableName}`);
    if (!maxId) { cb(null); return; }
    const id = maxId[0]['MAX(id_vartotojai)'];

    values.registracijos_data = moment(values.registracijos_data).utc().format('YYYY-MM-DD HH:MM:SS');
    values.paskutinis_prisijungimas = moment(values.paskutinis_prisijungimas).utc().format('YYYY-MM-DD HH:MM:SS');
    values.balansas = parseFloat(values.balansas);
    values.aktyvuotas = values.aktyvuotas ? 1 : 0;

    const result = await mysql.query(`INSERT INTO ${tableName} VALUES(?)`, 
        [ values.slapyvardis, values.slaptazodis, values.el_pastas,
            values.paskutinis_prisijungimas, values.registracijos_data,
                values.balansas, values.aktyvuotas, id + 1 ]);

    if (!result) { cb(null); return; }
    cb(result);
}

/**
 * Atnaujina vartotoją pagal gautus duomenis iš kliento
 * @param {string} data
 * @param {Function} cb 
 */
async function update(data, cb) {
    // if (!data) {
    //     socket.emit(tableName, routeName, null);
    //     return;
    // }

    // let columns = '';
    // let colArray = [];
    // for (const prop in data) {
    //     if (prop.startsWith('id_vartotojai')) continue;
    //     columns += `${prop} = ?, `;
    //     colArray.push(data[prop]);
    // }

    // columns = columns.substring(0, columns.length - 2);

    // if (columns.length === 0 || colArray.length === 0) {
    //     socket.emit(tableName, routeName, null);
    //     return;
    // }

    // const result = await mysql.query(`UPDATE ${tableName} SET ${columns} WHERE id_vartotojai = ?`, [ ...colArray, data.id_vartotojai ]);
    // if (!result) socket.emit(tableName, routeName, null);
    // socket.emit(tableName, routeName, result);
}