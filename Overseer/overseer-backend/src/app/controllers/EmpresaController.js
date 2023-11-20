const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');


class EmpresaController {
    async show(req, res) {
        try {
            const empresa = await sequelize.query(`
            select * from empresa order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(empresa);
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }
    async consultarEmpresa(req, res) {
        try {
            const consultarEmpresa = await sequelize.query(`
            select * from Empresa where id = ${req.params.id}
        `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarEmpresa)
        } catch (err) {
            return res.status(500).send('Erro ao processar a requisição')
        }

    }

    async inserirEmpresa(req, res) {
        const { id, empresa, cnpj } = req.body
        try {
            if (id > 0) {
                await sequelize.query(`
                   update empresa set 
                       empresa='${empresa}'
                   ,   cnpj = '${cnpj}'
                   ,   updatedAt = getDate()
                   where id = ${id}
               `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Empresa atualizada com sucesso !')
            } else {

                await sequelize.query(`
               insert into Empresa (empresa, cnpj, updatedAt, createdAt) 
               values(
                       '${empresa}'
                   ,   '${cnpj}'       
                   ,   getDate()
                   ,   getDate()
                   
               )
               
               `, { type: QueryTypes.INSERT })

                return res.status(200).send('Empresa criada com sucesso !')
            }
        } catch (err) {
            if (err.parent.code === 'EREQUEST') {
                return res.status(409).send('Empresa cadastrada em nossa base de dados')
            } else {
                return res.status(500).send('Erro ao processar requisição')
            }
        }


    }
    async deletarEmpresa(req, res) {

        const deleteEmpresa = await sequelize.query(`
            delete from Usuarios where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteEmpresa) res.status(404).send('Empresa não encontrada.');
        return res.status(200).send('Empresa exluida')
    }




}
module.exports = new EmpresaController()