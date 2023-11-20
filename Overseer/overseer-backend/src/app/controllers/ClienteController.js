const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class ClienteController {
    async show(req, res) {
        try {
            const cliente = await sequelize.query(`
            select * from cliente order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(cliente);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async consultarCliente(req, res) {
        try {
            const consultarCliente = await sequelize.query(`
            select * from Cliente where id = ${req.params.id}
        `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarCliente)
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }

    async inserirCliente(req, res) {
        const { id, cliente } = req.body
        try {
            if (id > 0) {
                await sequelize.query(`
                   update Cliente set 
                       cliente='${cliente}'
                   ,   updatedAt = getDate()
                   where id = ${id}
               `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Cliente atualizado com sucesso !')
            } else {

                await sequelize.query(`
               insert into Cliente (cliente, updatedAt, createdAt) 
               values(
                       '${cliente}'      
                   ,   getDate()
                   ,   getDate()
                   
               )
               
               `, { type: QueryTypes.INSERT })

                return res.status(200).send('Cliente criado com sucesso !')
            }
        } catch (err) {
            if (err.parent.code === 'EREQUEST') {
                return res.status(409).send('Cliente cadastrado em nossa base de dados')
            } else {
                return res.status(500).send('Erro ao processar requisição')
            }
        }


    }
    async deletarCliente(req, res) {

        const deleteCliente = await sequelize.query(`
            delete from Cliente where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteCliente) res.status(404).send('Cliente não encontrado.');
        return res.status(200).send('Cliente exluido')
    }




}
module.exports = new ClienteController()