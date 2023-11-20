const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class RegistroVisitaController {
    async teste(req, res) {
        const registros = req.body
        console.log(registros)
    }

    async show(req, res) {
        try {
            const registros = await sequelize.query(`
            select 
            id = r.id
        ,	status = s.status
        ,	cpf = v.cpf
        ,	nome = v.nome
        ,   empresa = e.empresa
        ,   motivo =  m.motivo
        ,   visitado = r.visitado
        ,	entrada = convert(varchar,(r.entrada),103) 
        ,	saida = convert(varchar,(r.saida),103) 
        from RegistroVisita r
        join Status s on s.id = r.idStatus 
        join Visitantes v on v.id = r.idVisitante
		join empresa e on e.id = r.idEmpresa
		join motivo m on m.id = r.idMotivo
        where idStatus = 1
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(registros)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
    async showStatus(req, res) {
        const { status } = req.body
        try {
            const registros = await sequelize.query(`
            select 
            id = r.id
        ,	status = s.status
        ,	cpf = v.cpf
        ,	nome = v.nome
        ,   empresa = e.empresa
        ,   motivo =  m.motivo
        ,   visitado = r.visitado
        ,	entrada = convert(varchar,(r.entrada),103) 
        ,	saida = convert(varchar,(r.saida),103) 
        from RegistroVisita r
        join Status s on s.id = r.idStatus 
        join Visitantes v on v.id = r.idVisitante
        join empresa e on e.id = r.idEmpresa
		join motivo m on m.id = r.idMotivo
        where idStatus = ${status}
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(registros)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
    async inserirRegistro(req, res) {
        const { idVisitante, empresa, motivo, visitado, idUsuario } = req.body
        try {
            await sequelize.query(`
                Insert into RegistroVisita (idVisitante, entrada, idEmpresa, idMotivo, idStatus, visitado, idUsuario, updatedAt, createdAt)
                        values(
                            '${idVisitante}' 
                        ,   getdate()
                        ,   '${empresa}'
                        ,   '${motivo}'
                        ,   '1'
                        ,   '${visitado}'
                        ,   ${idUsuario}
                        ,   getdate()
                        ,   getdate()
                        )
            `, { type: QueryTypes.INSERT })
            return res.status(200).send('Registro inserido com sucesso !')

        } catch (err) {
            return res.status(500).send('Erro ao processar requisição')
        }
    }
    async encerrarRegistro(req, res) {
        const { observacao } = req.body
        try {
            await sequelize.query(`
            update RegistroVisita set idStatus = 2, saida = getDate(), obs = '${observacao}', updatedAt= getDate() where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.UPDATE })
            return res.status(200).send('Registro encerrado com sucesso !')
        } catch (err) {
            return res.status(500).send('Erro ao processar requisição')
        }

    }
    async cancelarRegistro(req, res) {
        const { observacao } = req.body
        try {
            await sequelize.query(`
                update RegistroVisita set idStatus = 3, saida = getDate(), obs = '${observacao}', updatedAt= getDate() where id = ${parseInt(req.params.id)}
            `, { type: QueryTypes.UPDATE })
            return res.status(200).send('Registro cancelado com sucesso !')

        } catch (err) {
            return res.status(500).send('Erro ao processar requisição')
        }
    }

}
module.exports = new RegistroVisitaController()

/*async show(req, res) {
    try {
        const perfil = await sequelize.query(`
        select * from Perfil order by id
        `, { type: QueryTypes.SELECT })
        return res.status(200).send(perfil);
    } catch (err) {
        return res.status(500).send('Erro ao processar a requisição')
    }

}*/