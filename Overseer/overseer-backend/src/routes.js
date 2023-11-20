const {Router}= require ('express')

//const AlunoController = require('../src/app/controllers/AlunosController')
const SessionController = require('../src/app/controllers/SessionController')
const UsuarioController = require('../src/app/controllers/UsuarioController')
const PerfilController = require('../src/app/controllers/PerfilController')
const VisitanteController = require('./app/controllers/VisitanteController') 
const MotivoController = require('../src/app/controllers/MotivoController') 
const EmpresaController = require('../src/app/controllers/EmpresaController') 
const ClienteController = require('../src/app/controllers/ClienteController') 
const RegistroVisitaController = require('../src/app/controllers/RegistroVisitaController')
const StatusController = require('../src/app/controllers/StatusController')
const RelatorioController = require('../src/app/controllers/RelatorioController')
const FornecedorController = require('./app/controllers/FornecedorController')
const TipoController = require('./app/controllers/TipoController')
const MotoristaController = require('./app/controllers/MotoristaController')
const RegistroEntradaController = require('./app/controllers/RegistroEntradaController')




const routes = Router();

//Sessão
routes.post('/signin', SessionController.autenticar)


//Usuário
routes.get('/usuarios', SessionController.verificarToken, UsuarioController.show)
routes.post('/usuarios', UsuarioController.inserirUsuario)
routes.post('/usuarios/:id',  UsuarioController.consultarUsuario)
routes.delete('/usuarios/:id', UsuarioController.deletarUsuario)

// Perfil

routes.get('/perfil', SessionController.verificarToken, PerfilController.show)
routes.post('/perfil', PerfilController.inserirPerfil)
routes.post('/perfil/:id',  PerfilController.consultarPerfil)
routes.delete('/perfil/:id',  PerfilController.deletarPerfil)

//Visitantes
routes.get('/visitantes', SessionController.verificarToken, VisitanteController.show)
routes.post('/visitante', VisitanteController.buscarVisitante)
routes.post('/visitantes', VisitanteController.inserirVisitante)
routes.post('/visitantes/:id',  VisitanteController.consultarVisitante)
routes.delete('/visitantes/:id',  VisitanteController.deletarVisitante)

//Motorista
routes.get('/motorista', SessionController.verificarToken, MotoristaController.show)
//routes.post('/motoristas', MotoristaController.buscarMotorista)
routes.post('/motoristas', MotoristaController.teste)
//routes.post('/motoristas', MotoristaController.inserirMotorista)
routes.post('/motoristas/:id',  MotoristaController.consultarMotorista)
routes.delete('/motoristas/:id',  MotoristaController.deletarMotorista)

//Motivos
routes.get('/motivos', SessionController.verificarToken, MotivoController.show)
routes.post('/motivo', MotivoController.consultarMotivo)
routes.post('/motivos', MotivoController.inserirMotivo)
routes.post('/motivos/:id',  MotivoController.consultarMotivo)
routes.delete('/motivos/:id',  MotivoController.deletarMotivo)

//Empresa
routes.get('/empresas', SessionController.verificarToken, EmpresaController.show)
routes.post('/empresa', EmpresaController.consultarEmpresa)
routes.post('/empresas', EmpresaController.inserirEmpresa)
routes.post('/empresas/:id',  EmpresaController.consultarEmpresa)
routes.delete('/empresas/:id',  EmpresaController.deletarEmpresa)

//Cliente
routes.get('/clientes', SessionController.verificarToken, ClienteController.show)
routes.post('/cliente', ClienteController.consultarCliente)
routes.post('/clientes', ClienteController.inserirCliente)
routes.post('/clientes/:id',  ClienteController.consultarCliente)
routes.delete('/clientes/:id',  ClienteController.deletarCliente)

//Fornecedor
routes.get('/fornecedores', SessionController.verificarToken, FornecedorController.show)
routes.post('/fornecedor', FornecedorController.consultarFornecedor)
routes.post('/fornecedores', FornecedorController.inserirFornecedor)
routes.post('/fornecedores/:id',  FornecedorController.consultarFornecedor)
//routes.get('/fornecedoresN',  FornecedorController.consultaNomeFornecedor)
routes.delete('/fornecedores/:id',  FornecedorController.deletarFornecedor)

//Registro de Visitas
routes.get('/registroVisita', SessionController.verificarToken, RegistroVisitaController.show)
routes.post('/registroVisita', RegistroVisitaController.inserirRegistro)
routes.post('/registroVisitas', RegistroVisitaController.showStatus)
routes.post('/encerrarVisita/:id',  RegistroVisitaController.encerrarRegistro)
routes.post('/cancelarVisita/:id',  RegistroVisitaController.cancelarRegistro)

//Registro de Recebimento
routes.post('/registroRecebimento', RegistroEntradaController.teste)

//Status
routes.get('/status', SessionController.verificarToken, StatusController.show)

//Tipo
routes.get('/tipoE', SessionController.verificarToken, TipoController.showEntrada)
routes.get('/tipoS', SessionController.verificarToken, TipoController.showSaida)

//Relatórios
routes.post('/relatorioVisita', RelatorioController.show)
routes.get('/contadorVisitas', RelatorioController.contadorVisitantes)


module.exports = routes;