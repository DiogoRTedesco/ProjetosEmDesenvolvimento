const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class MotoristaController {
    async show(req, res) {
        try {
            const motorista = await sequelize.query(`
            select * from Motorista order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(motorista);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async consultarMotorista(req, res) {
        try {
            const consultarMotorista = await sequelize.query(`
            select * from Motorista where id = ${req.params.id}
        `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarMotorista)
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async teste(req, res){
        const { id, cpfMotorista, nomeMotorista, externo } = req.body

        console.log(req.body)
    }
    async inserirMotorista(req, res) {
        const { id, cpfMotorista, nomeMotorista, externo } = req.body
        try {
            if (id > 0) {
                await sequelize.query(`
                   update Motorista set 
                       cpfMotorista='${cpfMotorista}' 
                   ,   nomeMotorista='${nomeMotorista}'
                   ,   Externo='${externo}'
                   ,   updatedAt = getDate()
                   where id = ${id}
               `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Motorista atualizada com sucesso !')
            } else {

                await sequelize.query(`
               insert into Motorista (cpfMotorista, nomeMotorista, externo, updatedAt, createdAt) 
               values(
                       '${cpfMotorista}'
                   ,   '${nomeMotorista}' 
                   ,   '${externo}'     
                   ,   getDate()
                   ,   getDate()
                   
               )
               
               `, { type: QueryTypes.INSERT })

                return res.status(200).send('Motorista criada com sucesso !')
            }
        } catch (err) {
            if (err.parent.code === 'EREQUEST') {
                return res.status(409).send('Motorista cadastrado em nossa base de dados')
            } else {
                return res.status(500).send('Erro ao processar requisição')
            }
        }


    }
    async deletarMotorista(req, res) {

        const deleteMotorista = await sequelize.query(`
            delete from Usuarios where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteMotorista) res.status(404).send('Motorista não encontrado.');
        return res.status(200).send('Motorista exluido')
    }




}
module.exports = new MotoristaController()