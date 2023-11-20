const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class MotivoController {
    async show(req, res) {
        try {
            const motivo = await sequelize.query(`
            select * from Motivo order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(motivo);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async consultarMotivo(req, res) {
        try {
            const consultarMotivo = await sequelize.query(`
            select * from Motivo where id = ${req.params.id}
        `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarMotivo)
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }

    async inserirMotivo(req, res) {
        const { id, motivo } = req.body
        try {
            if (id > 0) {
                await sequelize.query(`
                   update Motivo set 
                       motivo='${motivo}'
                   ,   updatedAt = getDate()
                   where id = ${id}
               `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Motivo atualizado com sucesso !')
            } else {

                await sequelize.query(`
               insert into Motivo (motivo,  updatedAt, createdAt) 
               values(
                       '${motivo}'   
                   ,   getDate()
                   ,   getDate()
                   
               )
               
               `, { type: QueryTypes.INSERT })

                return res.status(200).send('Motivo criado com sucesso !')
            }
        } catch (err) {
            if (err.parent.code === 'EREQUEST') {
                return res.status(409).send('Motivo cadastrado em nossa base de dados')
            } else {
                return res.status(500).send('Erro ao processar requisição')
            }
        }


    }
    async deletarMotivo(req, res) {

        const deleteMotivo = await sequelize.query(`
            delete from Usuarios where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteMotivo) res.status(404).send('Motivo não encontrado.');
        return res.status(200).send('Motivo exluido')
    }




}
module.exports = new MotivoController()