const express = require('express');
const mysql = require('../index');
const router = express.Router();

const tableName = 'vartotojai';

router.get('/', async (req, res) => {
    const result = await mysql.query(`SELECT * FROM ${tableName}`);
    
    if (!result) res.status(500).send('Error');

    res.send(result);
});

router.get('/:id', async (req, res) => {
    const result = await mysql.query(`SELECT * FROM ${tableName} WHERE id_vartotojai = ?`, [ req.params.id ]);
    
    if (!result) res.status(500).send('Error');

    res.send(result);
});

router.delete('/:id', async (req, res) => {
    const result = await mysql.query(`DELETE FROM ${tableName} WHERE id_vartotojai = ?`, [ req.params.id ]);

    if (!result) res.status(500).send('Error');

    res.send(req.params.id);
});

router.get('/activate/:id', async (req, res) => {
    const result = await mysql.query(`UPDATE ${tableName} SET aktyvuotas = 1 WHERE id_vartotojai = ?`, [ req.params.id ]);

    if (!result) res.status(500).send('Error');

    res.send(req.params.id);
});

module.exports = router;