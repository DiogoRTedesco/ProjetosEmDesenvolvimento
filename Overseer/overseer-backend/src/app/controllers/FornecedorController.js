const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class FornecedorController {
    async show(req, res) {
        try {
            const fornecedor = await sequelize.query(`
            select * from Fornecedor order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(fornecedor);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async consultarFornecedor(req, res) {
        try {
            const consultarFornecedor = await sequelize.query(`
            select * from Fornecedor where id = ${req.params.id}
        `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarFornecedor)
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }

    async inserirFornecedor(req, res) {
        const { id, fornecedor } = req.body
        try {
            if (id > 0) {
                await sequelize.query(`
                   update Fornecedor set 
                       Fornecedor='${fornecedor}'
                   ,   updatedAt = getDate()
                   where id = ${id}
               `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Fornecedor atualizada com sucesso !')
            } else {

                await sequelize.query(`
               insert into Fornecedor (fornecedor, updatedAt, createdAt) 
               values(
                       '${fornecedor}'       
                   ,   getDate()
                   ,   getDate()
                   
               )
               
               `, { type: QueryTypes.INSERT })

                return res.status(200).send('Fornecedor criada com sucesso !')
            }
        } catch (err) {
            if (err.parent.code === 'EREQUEST') {
                return res.status(409).send('Fornecedor cadastrado em nossa base de dados')
            } else {
                return res.status(500).send('Erro ao processar requisição')
            }
        }


    }
    async deletarFornecedor(req, res) {

        const deleteFornecedor = await sequelize.query(`
            delete from Usuarios where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteFornecedor) res.status(404).send('Fornecedor não encontrado.');
        return res.status(200).send('Fornecedor exluido')
    }




}
module.exports = new FornecedorController()