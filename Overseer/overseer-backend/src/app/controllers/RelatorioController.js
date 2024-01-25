const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class RelatorioController {
    async teste(req, res) {
        const registros = req.body
        console.log(registros)
    }

    async showVisitantes(req, res) {
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
    async showSaidas(req, res) {
        const { entrada, saida, status } = req.body
        try {
            const registros = await sequelize.query(`
            select 
            id = r.id
        ,	status = s.status
        ,	tipo = t.tipo
        ,	cliente = c.Cliente
        ,	motorista = m.NomeMotorista
        ,	placa = r.Placa
        ,	notafiscal = r.notafiscal
        ,   procedencia = r.procedencia
		,	assunto = r.Assunto
        ,	entrada = convert(varchar,(r.entrada),103)  ${' + '} '     ' ${' + '}  convert(varchar,(r.entrada),108)
		,	saida = convert(varchar,(r.saida),103)  ${' + '} '     ' ${' + '}  convert(varchar,(r.saida),108)
		,	observacao = r.obs
        from RegistroSaida r
        join Status s on s.id = r.idStatus 
        join Cliente c on c.id = r.idCliente
        join Tipo t on t.id = r.idTipo
        join Motorista m on m.id = r.idMotorista
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
    async showRecebimentos(req, res) {
        const { entrada, saida, status } = req.body
        try {
            const registros = await sequelize.query(`
            select 
            id = r.id
        ,	status = s.status
        ,	tipo = t.tipo
        ,	fornecedor = f.fornecedor
        ,	motorista = m.NomeMotorista
        ,	placa = r.Placa
        ,	notafiscal = r.notafiscal
        ,   procedencia = r.procedencia
		,	assunto = r.Assunto
        ,	entrada = convert(varchar,(r.entrada),103)  ${' + '} '     ' ${' + '}  convert(varchar,(r.entrada),108)
		,	saida = convert(varchar,(r.saida),103)  ${' + '} '     ' ${' + '}  convert(varchar,(r.saida),108)
		,	observacao = r.obs
        from RegistroRecebimento r
        join Status s on s.id = r.idStatus
        join Fornecedor f on f.id = r.idFornecedor
        join Tipo t on t.id = r.idTipo
        join Motorista m on m.id = r.idMotorista
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

    async contadorRecebimentos(req, res) {
        try {
            const contadorV = await sequelize.query(`
            select Contador = Count(*)
            from RegistroRecebimento r
            where r.idStatus = 1
        
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(contadorV)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }

    async contadorSaidas(req, res) {
        try {
            const contadorV = await sequelize.query(`
            select Contador = Count(*)
            from RegistroSaida r
            where r.idStatus = 1
        
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(contadorV)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
    
}
module.exports = new RelatorioController()