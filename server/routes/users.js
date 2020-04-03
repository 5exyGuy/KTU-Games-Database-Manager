const express = require('express');
const mysql = require('../index');
const router = express.Router();

const tableName = 'vartotojai';

router.get('/', (req, res) => {
    mysql.query(`SELECT * FROM ${tableName}`, (error, results, fields) => {
        if (error) {
            res.status(404).send();
            return;
        }
        res.send(results);
    });
});

module.exports = router;