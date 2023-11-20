const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class RelatorioController {
    async teste(req, res) {
        const registros = req.body
        console.log(registros)
    }

    async show(req, res) {
        const { entrada, saida, status } = req.body
        try {
            const registros = await sequelize.query(`
            select 
            id = r.id
        ,	status = s.status
        ,	cpf = v.cpf
        ,	nome = v.nome
        ,	entrada = convert(varchar,(r.entrada),103)  ${' + '} '     ' ${' + '}  convert(varchar,(r.entrada),108)
		,	saida = convert(varchar,(r.saida),103)  ${' + '} '     ' ${' + '}  convert(varchar,(r.saida),108)
		,	pessoaVisitada = r.visitado
		,	observacao = r.obs
        from RegistroVisita r
        join Status s on s.id = r.idStatus 
        join Visitantes v on v.id = r.idVisitante
        where (${status} = 0 or r.idStatus = ${status})
		and (Convert(smalldatetime, Convert(VarChar, r.entrada, 112)) >= '${entrada}' or IsNull('${entrada}', '')= '')
		and	(Convert(smalldatetime, Convert(VarChar, r.entrada, 112)) <= '${saida}' or IsNull('${saida}', '')= '')
        order by r.entrada
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(registros)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
    async contadorVisitantes(req, res) {
        try {
            const contadorV = await sequelize.query(`
            select Contador = Count(*)
            from RegistroVisita r
            where r.idStatus = 1
        
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(contadorV)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
    
}
module.exports = new RelatorioController()