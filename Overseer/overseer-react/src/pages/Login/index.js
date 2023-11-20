import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import CioneVazado from '../../images/CioneLogoVazado.png';
import Overseer from '../../images/OverseerLogo.png';
// import { Container } from './styles';

export const Login = () => {
  const auth = useContext(AuthContext)
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');



  const handleLogin = async (e) => {
    e.preventDefault()
    if (usuario && password) {
      await auth.signin(usuario, password);
    } else {
      alert('Informe Usuário e Senha')
    }

  }



  return (
    

      <div className='Login'>
        <img  src={CioneVazado} alt='CioneVazado' className='LogoCione' />
        <Form>
          <img src={Overseer} alt='Overseer' className='Logo' />
          <Form.Group className="mb-3" controlId="formBasicUser">
            <Form.Label>Usuário</Form.Label>
            <Form.Control type="text" placeholder="Digite seu Usuário" onChange={e => { setUsuario(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Digite sua senha" onChange={e => { setPassword(e.target.value) }} />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={handleLogin}>
            Login
          </Button>
        </Form>
      </div>

     
    
  )
}