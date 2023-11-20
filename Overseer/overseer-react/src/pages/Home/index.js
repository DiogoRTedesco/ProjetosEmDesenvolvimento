import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { api } from '../../hooks/useApi';
import cionet from '../../images/cioneLogoPequena.png';
const token = sessionStorage.getItem('authToken');
// import { Container } from './styles';

function Home() {
  const [dados, setDados] = useState([])
  const [contadorV, setContadorV] = useState('')


  const contadorVisitantes = async () => {
    await api.get('/contadorVisitas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setDados(response.data)
        
      }).catch(err => {
        alert(err.response.data)
      })
  }
  useEffect(() => {
    contadorVisitantes()
  }, [])
  useEffect(() => {
    dados.map((c)=>(
      setContadorV(c.Contador)
    ))
  }, [dados])






  return <div className='Card'>
    <Card style={{ width: '15rem', margin: '5px' }}>
      <Card.Img variant="top" src={cionet} />
      <Card.Body>
        <Card.Title>Visitas em aberto</Card.Title>
        <Card.Text>
          Você possui no total de {contadorV} visitas em aberto
        </Card.Text>
        
      </Card.Body>
    </Card>
    <Card style={{ width: '15rem', margin: '5px' }}>
      <Card.Img variant="top" src={cionet} />
      <Card.Body>
        <Card.Title>Recebimentos em aberto</Card.Title>
        <Card.Text>
          Você possui no total de 0 entregas em aberto
        </Card.Text>
        
      </Card.Body>
    </Card>
    <Card style={{ width: '15rem', margin: '5px' }}>
      <Card.Img variant="top" src={cionet} />
      <Card.Body>
        <Card.Title>Saídas em aberto</Card.Title>
        <Card.Text>
          Você possui no total de 0 Saídas em aberto
        </Card.Text>
        
      </Card.Body>
    </Card>
  </div>;
}

export default Home;