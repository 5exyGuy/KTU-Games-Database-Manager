const mysql = require('../index');

const tableName = 'uzsakymai'; // Lentelės pavadinimas

exports.route = function route(socket, routeName, data) {
    const fn = routes[routeName];
    if (!fn) return;
    fn(socket, routeName, data);
}

const routes = {
    selectAll: selectAll,
    selectId: selectId,
    deleteId: deleteId,
    insert: insert,
    update: update
};

/**
 * Gauna visus užsakymus iš duomenų bazės
 * @param {SocketIO.Socket} socket 
 * @param {string} routeName
 * @param {any} data 
 */
async function selectAll(socket, routeName) {
    const result = await mysql.query(`SELECT * FROM ${tableName}`);
    if (!result) socket.emit(tableName, routeName, null);
    socket.emit(tableName, routeName, result);
}

/**
 * Randa užsakymą pagal ID
 * @param {SocketIO.Socket} socket 
 * @param {string} routeName
 * @param {any} data 
 */
async function selectId(socket, routeName, data) {
    if (!data) {
        socket.emit(tableName, routeName, null);
        return;
    }
    const result = await mysql.query(`SELECT * FROM ${tableName} WHERE id_uzsakymai = ?`, [ data.id ]);
    if (!result) socket.emit(tableName, routeName, null);
    socket.emit(tableName, routeName, result);
}


/**
 * Pašalina užsakymą iš duomenų bazės pagal ID
 * @param {SocketIO.Socket} socket 
 * @param {string} routeName
 * @param {any} data 
 */
async function deleteId(socket, routeName, data) {
    if (!data) {
        socket.emit(tableName, routeName, null);
        return;
    }
    const result = await mysql.query(`DELETE FROM ${tableName} WHERE id_uzsakymai = ?`, [ req.params.id ]);
    if (!result) socket.emit(tableName, routeName, null);
    socket.emit(tableName, routeName, result);
}

/**
 * Įterpia naują užsakymą į duomenų bazę pagal gautus duomenis iš kliento
 * @param {SocketIO.Socket} socket 
 * @param {string} routeName
 * @param {any} data 
 */
async function insert(socket, routeName, data) {
    if (!data) {
        socket.emit(tableName, routeName, null);
        return;
    }
    const result = await mysql.query(`INSERT INTO ${tableName} VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [ data.slapyvardis, data.slaptazodis, data.el_pastas, data.registracijos_data, data.paskutinis_prisijungimas, data.balansas ]);
    if (!result) socket.emit(tableName, routeName, null);
    socket.emit(tableName, routeName, result);
}

/**
 * Atnaujina užsakymą pagal gautus duomenis iš kliento
 * @param {SocketIO.Socket} socket 
 * @param {string} routeName
 * @param {any} data 
 */
async function update(socket, routeName, data) {
    if (!data) {
        socket.emit(tableName, routeName, null);
        return;
    }

    let columns = '';
    let colArray = [];
    for (const prop in data) {
        if (prop.startsWith('id_uzsakymai')) continue;
        columns += `${prop} = ?, `;
        colArray.push(data[prop]);
    }

    columns = columns.substring(0, columns.length - 2);

    if (columns.length === 0 || colArray.length === 0) {
        socket.emit(tableName, routeName, null);
        return;
    }

    const result = await mysql.query(`UPDATE ${tableName} SET ${columns} WHERE id_uzsakymai = ?`, [ ...colArray, data.id_vartotojai ]);
    if (!result) socket.emit(tableName, routeName, null);
    socket.emit(tableName, routeName, result);
}