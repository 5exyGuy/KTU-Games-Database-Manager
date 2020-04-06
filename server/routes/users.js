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

module.exports = router;