import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { api } from '../../hooks/useApi';
import cionet from '../../images/cioneLogoPequena.png';
const token = sessionStorage.getItem('authToken');
// import { Container } from './styles';

function Home() {
  const [dadosVisitante, setDadosVisitante] = useState([])
  const [dadosRecebimento, setDadosRecebimento] = useState([])
  const [dadosSaidas, setDadosSaidas] = useState([])
  const [contadorVisitante, setContadorVisitante] = useState('')
  const [contadorRecebimento, setContadorRecebimento] = useState('')
  const [contadorSaida, setContadorSaida] = useState('')


  const contadorVisitantes = async () => {
    await api.get('/contadorVisitas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setDadosVisitante(response.data)
        
      }).catch(err => {
        alert(err.response.data)
      })
  }
  const contadorRecebimentos = async () => {
    await api.get('/contadorRecebimentos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setDadosRecebimento(response.data)
        
      }).catch(err => {
        alert(err.response.data)
      })
  }
  const contadorSaidas = async () => {
    await api.get('/contadorSaidas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setDadosSaidas(response.data)
        
      }).catch(err => {
        alert(err.response.data)
      })
  }
  useEffect(() => {
    contadorVisitantes()
    contadorRecebimentos()
    contadorSaidas()
  }, [])
  useEffect(() => {
    dadosVisitante.map((c)=>(
      setContadorVisitante(c.Contador)
    ))
  }, [dadosVisitante])
  useEffect(() => {
    dadosRecebimento.map((c)=>(
      setContadorRecebimento(c.Contador)
    ))
  }, [dadosRecebimento])
  useEffect(() => {
    dadosSaidas.map((c)=>(
      setContadorSaida(c.Contador)
    ))
  }, [dadosSaidas])






  return <div className='Card'>
    <Card style={{ width: '15rem', margin: '5px' }}>
      <Card.Img variant="top" src={cionet} />
      <Card.Body>
        <Card.Title>Visitas em aberto</Card.Title>
        <Card.Text>
          Você possui no total de {contadorVisitante} visitas em aberto
        </Card.Text>
        
      </Card.Body>
    </Card>
    <Card style={{ width: '15rem', margin: '5px' }}>
      <Card.Img variant="top" src={cionet} />
      <Card.Body>
        <Card.Title>Recebimentos em aberto</Card.Title>
        <Card.Text>
          Você possui no total de {contadorRecebimento} entregas em aberto
        </Card.Text>
        
      </Card.Body>
    </Card>
    <Card style={{ width: '15rem', margin: '5px' }}>
      <Card.Img variant="top" src={cionet} />
      <Card.Body>
        <Card.Title>Saídas em aberto</Card.Title>
        <Card.Text>
          Você possui no total de {contadorSaida} Saídas em aberto
        </Card.Text>
        
      </Card.Body>
    </Card>
  </div>;
}

export default Home;