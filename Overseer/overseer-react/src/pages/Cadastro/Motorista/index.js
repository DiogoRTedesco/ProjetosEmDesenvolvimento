import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

const Motorista = (props) => {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [nomeMotorista, setNomeMotorista] = useState('')
    const [cpfMotorista, setCpfMotorista] = useState('')
    const [externo, setExterno] = useState(false)
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')

    useEffect(() => {
        buscarMotoristas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarMotoristas = async () => {
        const response = await api.get('/motorista', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err => alert(err.response.data))
        const data = await response.data
        setDados(data)
    }
    useEffect(() => {
        const filtrados = dados.filter((item) => {
            const valores = Object.values(item).join(' ').toLowerCase();
            const termoBusca = busca.toLowerCase().trim();
            return valores.includes(termoBusca);
        })
        setDadosFiltrados(filtrados)
    }, [busca, dados])
    const submit = (e) => {
        e.preventDefault()
        const motorista = {
            id: id,
            cpfMotorista: cpfMotorista,
            nomeMotorista: nomeMotorista,
            externo: externo
        }
        if (id === 0) {
            inserirMotorista(motorista)
        } else {
            atualizarMotorista(motorista)
        }
        fecharModal()
        //window.location.reload() 
    }

    const inserirMotorista = async (motorista) => {
        const res = window.confirm('Deseja cadastrar o motorista?')
        if (res === true) {
            await api.post('/motoristas', motorista).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }

    const atualizarMotorista = async (motorista) => {
        const res = window.confirm('Deseja alterar as informações deste Motorista?')
        if (res === true) {
            await api.post('/motorista', motorista).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    window.location.reload()
                } else {
                    window.location.reload()
                }
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }
    const deletarMotorista = async (motorista, id) => {
        const res = window.confirm(`Deseja excluir a Motorista ${id} - ${motorista} `)
        if (res === true) {
            await api.delete(`/motoristas/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarMotoristas()
                    window.location.reload()
                }
            }).catch(err => {
                alert(err.response.data)
            })
        } else {
            window.location.reload()
        }
    }
    const carregarDados = async (id) => {
        const response = await api.post(`/motoristas/${id}`)
        const data = await response.data
        data.map((mot, index) => (
            
            // eslint-disable-next-line no-sequences
            setId(mot.id),
            setNomeMotorista(mot.NomeMotorista),
            setCpfMotorista(mot.cpfMotorista),
            setExterno(mot.Externo)
            
            

        ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setCpfMotorista('')
        setNomeMotorista('')
        setExterno(false)
    }
    const abrirModal = () => {
        setModalAberta(true)
    }

    return (
        <div className='Pag'>
            <div><Form.Label>Cadastros - Motorista</Form.Label></div>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do Motorista</Modal.Title>
                </Modal.Header>
                <Modal.Body>  
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" disabled value={id} readOnly={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Motorista</Form.Label>
                            <Form.Control type="text" placeholder="Digite o nome do Motorista" value={nomeMotorista} onChange={(e) => { setNomeMotorista(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control type="text" placeholder="Digite o CPF do Motorista" value={cpfMotorista} onChange={(e) => { setCpfMotorista(e.target.value) }} />
                        </Form.Group>
                        <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                            label={externo === true? "Externo": "Interno"}
                            onChange={e=>{setExterno(e.target.checked)}}
                            checked={externo}
                            />
                            {/*console.log(externo)*/}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={fecharModal}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={submit}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button variant="warning" type="reset" onClick={abrirModal}>
                Novo
            </Button>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Filtro de busca</InputGroup.Text>
                <Form.Control
                    placeholder="Digite o termo de busca"
                    aria-label="Digite o termo de busca"
                    aria-describedby="basic-addon1"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
            </InputGroup>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome Motorista</th>
                        <th>CPF Motorista</th>
                        <th>Externo / Interno</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((mot, index) =>
                            <tr key={index}>
                                <td>{mot.id}</td>
                                <td>{mot.NomeMotorista}</td>
                                <td>{mot.cpfMotorista}</td>
                                <td>{mot.Externo === true?'Externo': 'Interno'}</td>

                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(mot.id)}>Atualizar</Button>{' '}
                                    <Button variant="danger" onClick={() => deletarMotorista(mot.NomeMotorista, mot.id)}>Excluir</Button>{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>



        </div>
    )
}

export default Motorista;