const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class VisitanteController {
    async show(req, res) {
        try {
            const visitante = await sequelize.query(`
            select *  
            from Visitantes
            order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).json(visitante);
        } catch (err) {
            return res.status(400).send(err)
        }

    }
    async consultarVisitante(req, res) {
        try{

            const consultarVisitante = await sequelize.query(`
            select 
               *
            from Visitantes
            where id = ${req.params.id}
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarVisitante)
        }catch(err){
            res.status(500).send(`Erro ao processar a requisão tente novamente ${err}`)
        }
    }

    async buscarVisitante(req, res) {
        const { cpf } = req.body
        try {
            const buscarVisitante = await sequelize.query(`
                select 
                    id
                ,   cpf
                ,   nome
                ,   dataEntrada = convert(varchar,getDate(),23)
                from Visitantes
                where cpf = '${cpf}'
            `, { type: QueryTypes.SELECT });
            if (buscarVisitante.length === 0) {
                return res.status(204).send('Dados Inválidos')
            } else {
                console.log(buscarVisitante.length)
                return res.status(200).send(buscarVisitante)
            }
        } catch (err) {
            res.status(500).send(`Erro ao processar a requisão tente novamente ${err}`)
        }
    }

    async inserirVisitante(req, res) {
        const { id, cpf, nome, nascimento, telefone, email } = req.body

        try {
            if (id > 0) {
                 await sequelize.query(`
                update Visitantes set 
                    cpf= '${cpf}'
                ,   nome='${nome}'
                ,   nascimento='${nascimento}'
                ,   telefone ='${telefone}'
                ,   email ='${email}'
                ,   updatedAt = getDate()
                where id = ${id}
            `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Visitante atualizado')
            } else {

                 await sequelize.query(`
            insert into Visitantes (cpf, nome, nascimento, telefone, email, updatedAt, createdAt) 
            values(
                    '${cpf}'
                ,   '${nome}'
                ,   '${nascimento}'
                ,   '${telefone}'
                ,   '${email}'
                ,   getDate()
                ,   getDate()
                
            )
            
            `, { type: QueryTypes.INSERT })

                return res.status(200).send('Visitante criado com sucesso!')
            }
        } catch (err) {
            if(err.parent.code === 'EREQUEST'){
                return res.status(409).send('CPF Cadastrado em nossa base de dados')
            }else{
                return res.status(500).send('Erro ao processar requisição')
            }
            
        }
        
    }
    async deletarVisitante(req, res) {

        const deleteVisitante = await sequelize.query(`
            delete from Visitantes where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteVisitante) res.status(404).send('Visitante não encontrado.');
        return res.status(200).send('Visitante exluido')
    }




}
module.exports = new VisitanteController()