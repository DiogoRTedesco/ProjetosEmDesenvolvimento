const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class RegistroSaidaController {
    async teste(req, res) {
        const registros = req.body
        console.log(registros)
    }

    async show(req, res) {
        try {
            const registros = await sequelize.query(`
        	Select     
            id = r.id
            ,	status = s.status 
            ,   tipo = t.tipo
            ,	cliente = c.cliente
            ,	motorista = m.NomeMotorista
            ,	placa = r.Placa
            ,	notafiscal = r.notafiscal
            ,	entrada = convert(varchar,(r.entrada),103) 
            ,	saida = convert(varchar,(r.saida),103)
            ,	assunto = r.Assunto
       
            from RegistroSaida r
            join Status s on s.id = r.idStatus
            join Cliente c on c.id = r.idCliente
            join Tipo t on t.id = r.idTipo
            join Motorista m on m.id = r.idMotorista
            where r.idStatus = 1
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
            Select     
                id = r.id
                ,	status = s.status 
                ,	tipo = t.tipo
                ,	cliente = c.Cliente
                ,	motorista = m.NomeMotorista
                ,	placa = r.Placa
                ,	notafiscal = r.notafiscal
                ,	entrada = convert(varchar,(r.entrada),103) 
                ,	saida = convert(varchar,(r.saida),103)
                ,	assunto = r.Assunto
                
            from RegistroSaida r
            join Status s on s.id = r.idStatus
            join Cliente c on c.id = r.idCliente
            join Tipo t on t.id = r.idTipo
            join Motorista m on m.id = r.idMotorista
            where idStatus = ${status}
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(registros)
        } catch (err) {
            res.status(500).send('Erro ao processar a requisição')
        }
    }
    async inserirRegistro(req, res) {
        const { tipo, cliente, procedencia, motorista, dataEntrada, notaFiscal, placa, observacao, idUsuario } = req.body
        try {
            await sequelize.query(`
                Insert into RegistroSaida (idTipo, idStatus, idCliente, idMotorista, Procedencia, Placa, Assunto, notafiscal, Entrada, idUsuarioInc, updatedAt, createdAt)
                        values(
                            '${tipo}' 
                        ,   '1'
                        ,   '${cliente}'
                        ,   '${motorista}'
                        ,   '${procedencia}'
                        ,   '${placa}'
                        ,   '${observacao}'
                        ,   '${notaFiscal}'
                        ,   Convert (datetime, '${dataEntrada}', 120)
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
            update RegistroSaida set idStatus = 2, saida = getDate(), obs = '${observacao}', updatedAt= getDate() where id = ${parseInt(req.params.id)}
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
                update RegistroSaida set idStatus = 3, saida = getDate(), obs = '${observacao}', updatedAt= getDate() where id = ${parseInt(req.params.id)}
            `, { type: QueryTypes.UPDATE })
            return res.status(200).send('Registro cancelado com sucesso !')

        } catch (err) {
            return res.status(500).send('Erro ao processar requisição')
        }
    }

}
module.exports = new RegistroSaidaController()

