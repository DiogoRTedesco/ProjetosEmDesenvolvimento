const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')


const { privateKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: {
	  type: 'spki',
	  format: 'pem'
	},
	privateKeyEncoding: {
	  type: 'pkcs8',
	  format: 'pem'
	}
  });
  
  // função para gerar tokens JWT com a chave privada
  function generateToken(payload) {
	try {
	  // assinar o payload com a chave privada
	  //return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn:'8h' });
	  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
	 
	} catch (error) {
	  console.error(error);
	  throw new Error('Erro ao gerar token');
	}
  };
  
  const validateToken = async (token) => {
	try {
	  // extrair o header do token JWT
	  const [headerEncoded] = token.split('.');
	  const header = JSON.parse(Buffer.from(headerEncoded, 'base64').toString());
  
	  // verificar o algoritmo de criptografia
	  if (header.alg !== 'RS256') {
		throw new Error('Algoritmo de criptografia inválido');
	  }
  
	  // verificar a assinatura do token com a chave pública
	  const publicKey = crypto.createPublicKey({ key: privateKey, type: 'pkcs8' });
	  const payload = jwt.verify(token, publicKey);
	  return payload 
	  
	} catch (error) {
	  console.error(error);
	  return error
	}
  };

module.exports = {
	async autenticar(req, res) {
		const { usuario, senha } = req.body;

		//console.log(`usuario: ${usuario}  senha: ${senha}`)

		const buscaUsuario = await sequelize.query(`
		Select 
		   u.id
		   , u.usuario
		   , u.senha
		   , p.NomePerfil 
		   , p.ValorPerfil
		from Usuarios u
		join Perfil p on p.id = u.perfil
		where u.Usuario = '${usuario}'
		and u.Ativo = 1
	`, {
			type: QueryTypes.SELECT
		});
		buscaUsuario.map(async (usr, index) => {
			const passwordCrypt = usr.senha
			const usuario = usr.usuario
			const level = usr.ValorPerfil
			const id = usr.id;


			//console.log(passwordCrypt)

			const password = await bcrypt.compare(senha, passwordCrypt);
			if (password === true) {
				res.status(200).json({
					user: {
						name: usuario,
						id: id,
						level: level
					},
					token: generateToken({user:{ id: id, name: usuario, level:level}})
					
				})
			} else {
				return res.status(404).send('Usuário ou senha incorretos.')
			}
		})
	},
	async verificarToken  (req, res, next)  {

		const tokenHeader = req.headers["authorization"];
		
		const token = tokenHeader && tokenHeader.split(" ")[1];
	
		
		if (!token) {
			return res.status(401).json({
				statusCode: 401,
				message: "Não autorizado!",
			})
		}
	
		validateToken(token)
		
		next()
		
		
	},
	destroy(req, res) {
		try {
			jwt.sign({ token, expiresIn: 0});
		} catch (error) {
			console.log({ message: error });
		}
	}
	
};
