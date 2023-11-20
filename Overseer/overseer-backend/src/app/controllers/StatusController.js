const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class StatusController {
    async teste(req, res) {
        const registros = req.body
        console.log(registros)
    }

    async show(req, res) {
        try {
            const status = await sequelize.query(`
            select * from Status order by id
           
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(status)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
}
module.exports = new StatusController();