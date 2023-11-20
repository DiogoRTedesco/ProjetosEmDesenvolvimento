import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../src/images/OverseerLogo.png';
import { AuthContext } from './contexts/Auth/AuthContext';
import { LoginAuth, RequireAuth } from './contexts/Auth/RequireAuth';
//importação das pages
import Cliente from './pages/Cadastro/Clientes';
import Empresa from './pages/Cadastro/Empresa';
import Fornecedor from './pages/Cadastro/Fornecedor';
import Motivo from './pages/Cadastro/Motivos';
import Motorista from './pages/Cadastro/Motorista';
import { Perfil } from './pages/Cadastro/Perfil';
import { Usuario } from './pages/Cadastro/Usuarios';
import Visitante from './pages/Cadastro/Visitantes';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { RegistroRecebimento } from './pages/Registro/Recebimento';
import { RegistroVisitantes } from './pages/Registro/Visitante';
import { RelatorioVisitante } from './pages/Relatório/Visitantes';
import Sobre from './pages/Sobre';




function Rotas() {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = async () => {
        const res =window.confirm('Deseja sair do sistema?')
        if(res ===true){
            await auth.signout();
            navigate('/')
        }
        //window.location.href = window.location.href;
    }
    /*useEffect(() => {
        window.onbeforeunload = function (event) {
            //localStorage.removeItem("authToken");
            event.preventDefault()
            console.log(event.type)
            if(event.type ==='onbeforeunload'){
                if( event.clientX < 0 && event.clientY < 0 && !event.persisted){
                    console.log('teste')
                }
                
            }

        };
    }, [])*/


    /* useEffect(() => {
       function handleClick(event) {
         const { clientX, clientY } = event;
         // Verifica se o usuário clicou em um elemento específico
         const element = document.getElementById('my-element');
         const elementBounds = element.getBoundingClientRect();
         if (clientX >= elementBounds.left && clientX <= elementBounds.right && clientY >= elementBounds.top && clientY <= elementBounds.bottom) {
           console.log('ClientX ' + clientX + ' ClientY ' + clientY);
         }
       }
   
       window.addEventListener('click', handleClick);
       return () => {
         window.removeEventListener('click', handleClick);
       };
     }, []);*/




    return (
        <div className="Routes">

            {auth.user && <img src={logo} alt='overseer' className='Logo' />}


            <Nav variant='tabs'>
                {auth.user && <Nav.Link as={Link} to='/home'>Inicio</Nav.Link>}
                {auth.user && <NavDropdown title="Cadastros" id="nav-dropdown">
                    {auth.user.level >= 3 && <NavDropdown.Item as={Link} to='/cliente' >Cliente</NavDropdown.Item>}
                    {auth.user.level >= 3 && <NavDropdown.Item as={Link} to='/fornecedor' >Fornecedor</NavDropdown.Item>}
                    {auth.user.level >= 3 && <NavDropdown.Item as={Link} to='/empresa' >Empresa</NavDropdown.Item>}
                    {auth.user.level >= 3 && <NavDropdown.Item as={Link} to='/motivo' >Motivo</NavDropdown.Item>}
                    {auth.user.level >= 5 && <NavDropdown.Item as={Link} to='/perfil' >Perfil</NavDropdown.Item>}
                    {auth.user.level >= 3 && <NavDropdown.Item as={Link} to='/visitante'>Visitante</NavDropdown.Item>}
                    {auth.user.level >= 3 && <NavDropdown.Item as={Link} to='/motorista'>Motorista</NavDropdown.Item>}
                    {auth.user.level >= 5 && <NavDropdown.Item as={Link} to='/usuario' >Usuário</NavDropdown.Item>}
                </NavDropdown>}
                {auth.user && <NavDropdown title="Movimentos" id="nav-dropdown">
                {auth.user.level >= 2 && <NavDropdown.Item as={Link} to='/visitantes'>Visitantes</NavDropdown.Item>}
                {auth.user.level >= 2 && <NavDropdown.Item as={Link} to='/recebimento' >Recebimento</NavDropdown.Item>}
                {auth.user.level >= 2 && <NavDropdown.Item as={Link} to='/saidas' >Saídas</NavDropdown.Item>}
                </NavDropdown>}
                {auth.user && <NavDropdown title="Relatórios" id="nav-dropdown">
                {auth.user.level >= 1 && <NavDropdown.Item as={Link} to='/relatorioVisitantes'>Visitantes</NavDropdown.Item>}
                {auth.user.level >= 1 && <NavDropdown.Item as={Link} to='/relatorioRecebimento' >Recebimento</NavDropdown.Item>}
                {auth.user.level >= 1 && <NavDropdown.Item as={Link} to='/relatorioSaidas' >Saídas</NavDropdown.Item>}
                </NavDropdown>}
                {auth.user  && <Nav.Link as={Link} to='/sobre'>Sobre</Nav.Link>}
                {auth.user && <Nav.Link as={Link} to='/' onClick={handleLogout}>Sair</Nav.Link>}
            </Nav>


            <Routes>
                <Route path='/' exact={true} element={<RequireAuth level={0}><LoginAuth><Login /></LoginAuth></RequireAuth>} />
                <Route path='/home' exact={true} element={<RequireAuth level={1}><Home /></RequireAuth>} />
                <Route path='/fornecedor' exact={true} element={<RequireAuth level={1}><Fornecedor /></RequireAuth>} />
                <Route path='/motorista' exact={true} element={<RequireAuth level={1}><Motorista/></RequireAuth>} />
                <Route path='/visitante' exact={true} element={<RequireAuth level={1}><Visitante /></RequireAuth>} />
                <Route path='/visitantes' exact={true} element={<RequireAuth level={1}><RegistroVisitantes /></RequireAuth>} />
                <Route path='/recebimento' exact={true} element={<RequireAuth level={1}><RegistroRecebimento /></RequireAuth>} />
                <Route path='/relatorioVisitantes' exact={true} element={<RequireAuth level={1}><RelatorioVisitante /></RequireAuth>} />
                <Route path='/motivo' exact={true} element={<RequireAuth level={3}><Motivo /></RequireAuth>} />
                <Route path='/empresa' exact={true} element={<RequireAuth level={3}><Empresa /></RequireAuth>} />
                <Route path='/cliente' exact={true} element={<RequireAuth level={3}><Cliente /></RequireAuth>} />
                <Route path='/sobre' exact={true} element={<RequireAuth level={4}><Sobre /></RequireAuth>} />
                <Route path='/perfil' exact={true} element={<RequireAuth level={5}><Perfil /></RequireAuth>} />
                <Route path='/usuario' exact={true} element={<RequireAuth level={5}><Usuario /></RequireAuth>} />
                
                
            </Routes>




        </div >
    );


}

export default Rotas;