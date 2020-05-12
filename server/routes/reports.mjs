import {
    pool
} from '../server.mjs';

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
    selectUserOrders: selectUserOrders
};

/**
 * @param {string} data
 * @param {Function} cb 
 */
async function selectUserOrders(data, cb) {
    const result = await pool.query(`SELECT u.id_uzsakymai, slapyvardis, el_pastas, u.busena, fuubp.brangiausias, fuubp.pigiausias, fuubp.suma, u.pvm,
    zuz.pavadinimas AS zaidimas, zuz.kaina,
    COUNT(CASE WHEN (zuz.pavadinimas = $1) AND (zuz.platforma = $2) THEN 1 END) AS rastas
FROM vartotojai
 RIGHT JOIN uzsakymai u ON vartotojai.id_vartotojai = u.fk_vartotojaiid_vartotojai
 RIGHT JOIN (zaidimu_uzsakymai zu INNER JOIN zaidimai z ON zu.fk_zaidimaiid_zaidimai = z.id_zaidimai)
     zuz ON u.id_uzsakymai = zuz.fk_uzsakymaiid_uzsakymai
 LEFT JOIN
     (SELECT fk_uzsakymaiid_uzsakymai, MAX(z.kaina) AS brangiausias, MIN(z.kaina) AS pigiausias,
             ROUND(CAST(SUM(z.kaina * zaidimu_uzsakymai.kiekis) AS NUMERIC), 2) as suma, SUM(zaidimu_uzsakymai.kiekis)
     FROM zaidimu_uzsakymai
         LEFT JOIN zaidimai z ON zaidimu_uzsakymai.fk_zaidimaiid_zaidimai = z.id_zaidimai
     GROUP BY fk_uzsakymaiid_uzsakymai) fuubp ON u.id_uzsakymai = fuubp.fk_uzsakymaiid_uzsakymai
WHERE vartotojai.id_vartotojai = $3
GROUP BY u.id_uzsakymai, slapyvardis, u.busena, zuz.pavadinimas, zuz.kaina, fuubp.brangiausias, fuubp.pigiausias,
      fuubp.suma, u.pvm, el_pastas`,
        [
            data.pavadinimas, data.platforma, data.id_vartotojai
        ]
    );
    if (result.rowCount === 0) return cb(null);
    cb(result.rows);
}