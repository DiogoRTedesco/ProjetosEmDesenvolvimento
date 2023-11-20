const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs')

class UsuarioController {
    async show(req, res) {
        try {
            const usuario = await sequelize.query(`
            select 
	            u.id
            ,	u.usuario
            ,	u.nome
            ,	u.senha
            ,	u.email
            ,	p.NomePerfil
            ,	p.ValorPerfil
            ,	u.ativo
            from Usuarios u
            join Perfil p on p.id = u.perfil
            order by id
            `, { type: QueryTypes.SELECT })
            return res.status(200).json(usuario);
        } catch (err) {
            return res.status(500).send('Erro ao processar requisição no servidor')
        }

    }
    async consultarUsuario(req, res) {
        try {
            const consultarUsuario = await sequelize.query(`
            select 
                u.id
            ,	u.usuario
            ,	u.nome
            ,	u.senha
            ,	u.email
            ,   u.perfil
            ,	p.NomePerfil
            ,	p.ValorPerfil
            ,	u.ativo
            from Usuarios u
            join Perfil p on p.id = u.perfil
            where u.id = ${req.params.id}
            `, { type: QueryTypes.SELECT })
            return res.status(200).send(consultarUsuario)
        } catch (err) {
            return res.status(500).send('Erro ao processar requisição')
        }

    }

    async inserirUsuario(req, res) {
        const { id, usuario, password, perfil, nome, email, ativo } = req.body

        const passwordCrypt = await bcrypt.hash(password, 8);
        try {
            if (id > 0) {
                 await sequelize.query(`
                update Usuarios set 
                    nome='${nome}'
                ,   usuario='${usuario}'
                ,   senha ='${passwordCrypt}'
                ,   email ='${email}'
                ,   perfil ='${perfil}'
                ,   ativo ='${ativo}'
                ,   updatedAt = getDate()
                where id = ${id}
            `, { type: QueryTypes.UPDATE })
                return res.status(200).send('Usuário atualizado com sucesso !')
            } else {

             await sequelize.query(`
            insert into Usuarios (nome, usuario, senha, email, perfil, ativo, updatedAt, createdAt) 
            values(
                    '${nome}'
                ,   '${usuario}'
                ,   '${passwordCrypt}'
                ,   '${email}'
                ,   '${perfil}'
                ,   '${ativo}'
                ,   getDate()
                ,   getDate()   
            )
            
            `, { type: QueryTypes.INSERT })

                return res.status(200).send('Usuário criado com sucesso')
            }
        } catch (err) {
            if(err.parent.code === 'EREQUEST'){
                return res.status(409).send('Existe um usuário cadastrado na base de dados')
            }else{
                return res.status(500).send('Erro ao processar requisição')
            }
            
        }
    }
    async deletarUsuario(req, res) {

        const deleteUsuario = await sequelize.query(`
            delete from Usuarios where id = ${parseInt(req.params.id)}
        `, { type: QueryTypes.DELETE })
        if (!deleteUsuario) res.status(404).send('Usuário não encontrado.');
        return res.status(200).send('Usuário exluido')
    }

    async teste(req, res) {
        const { id, usuario, password, perfil, nome, email, ativo } = req.body
        console.log(`id: ${id} , usuario: ${usuario}, password: ${password}, perfil: ${perfil}, nome: ${nome},email: ${email} ,ativo: ${ativo}`)
        console.log(req.body)
        res.json(req.body)
    }


}
module.exports = new UsuarioController()