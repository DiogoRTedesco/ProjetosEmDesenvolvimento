const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class TipoController {
    async showEntrada(req, res) {
        try {
            const tipoE = await sequelize.query(`
            select * from Tipo where TipoES = 'E' order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(tipoE);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async showSaida(req, res) {
        try {
            const tipoS = await sequelize.query(`
            select * from Tipo where TipoES = 'S' order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(tipoS);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }






}
module.exports = new TipoController()