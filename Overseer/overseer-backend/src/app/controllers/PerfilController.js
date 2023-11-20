const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class PerfilController {
    async show(req, res) {
        try {
            const perfil = await sequelize.query(`
            select * from Perfil order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(perfil);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async consultarPerfil(req, res) {
        try {
            const consultarPerfil = await sequelize.query(`
            select * from Perfil where id = ${req.params.id}
        `, { type: QueryTypes.SELECT })
            return res.status(200).json(consultarPerfil)
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }

    async inserirPerfil(req, res) {
        const { id, nomePerfil, valorPerfil } = req.body
        try {
            if (id > 0) {
                await sequelize.query(`
                   update Perfil set 
                       nomePerfil='${nomePerfil}'
                   ,   valorPerfil=${valorPerfil}
                   ,   updatedAt = getDate()
                   where id = ${id}
               `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Perfil atualizado com sucesso!')
            } else {

                await sequelize.query(`
               insert into Perfil (nomePerfil, valorPerfil, updatedAt, createdAt) 
               values(
                       '${nomePerfil}'
                   ,   ${valorPerfil}
                   ,   getDate()
                   ,   getDate()
                   
               )
               
               `, { type: QueryTypes.INSERT })

                return res.status(200).send('Perfil criado com sucesso !')
            }
        } catch (err) {
            if (err.parent.code === 'EREQUEST') {
                return res.status(409).send('Perfil cadastrado em nossa base de dados')
            } else {
                return res.status(500).send('Erro ao processar requisição')
            }
        }


    }
    async deletarPerfil(req, res) {

        const deletePerfil = await sequelize.query(`
            delete from Usuarios where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deletePerfil) res.status(404).send('Perfil não encontrado.');
        return res.status(200).send('Perfil exluido')
    }




}
module.exports = new PerfilController()