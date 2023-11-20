import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

function Motivo(props) {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [motivo, setMotivo] = useState('')
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')
    const auth = useContext(AuthContext)
    
    useEffect(() => {
        buscarMotivos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarMotivos = async () => {
        const response = await api.get('/motivos', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err =>alert(err.response.data))
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
        const motivos = {
            id: id,
            motivo: motivo,
        }
        if (id === 0) {
            inserirMotivo(motivos)
        } else {
            atualizaMotivo(motivos)
        }
        fecharModal()
        //window.location.reload() 
    }

    const inserirMotivo = async (motivo) => {
        const res = window.confirm('Deseja cadastrar o motivo?')
        if (res === true) {
            await api.post('/motivos', motivo).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }

    const atualizaMotivo = async (motivo) => {
        const res = window.confirm('Deseja alterar as informações deste motivo?')
        if (res === true) {
            await api.post('/motivos', motivo).then(response => {
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
    const deletarMotivo = async (motivo, id) => {
        const res = window.confirm(`Deseja excluir o Motivo ${id} - ${motivo} `)
        if (res === true) {
            await api.delete(`/motivos/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarMotivos()
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
        const response = await api.post(`/motivos/${id}`)
        const data = await response.data
        data.map((mot, index) =>(
            setId(mot.id)
            // eslint-disable-next-line no-sequences
            , setMotivo(mot.motivo)
           
    ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setMotivo('')
    }
    const abrirModal = () => {
        setModalAberta(true)
    }

    return (
        <div className='Pag'>
            <div><Form.Label>Cadastros - Motivo</Form.Label></div>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do Motivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" disabled value={id} readOnly={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Motivo</Form.Label>
                            <Form.Control type="text" placeholder="Digite o Motivo" value={motivo} onChange={(e) => { setMotivo(e.target.value) }} />
                        </Form.Group>
                       
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
                    onChange={(e)=> setBusca(e.target.value)}
                />
            </InputGroup>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Motivo</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((mot, index) =>
                            <tr key={index}>
                                <td>{mot.id}</td>
                                <td>{mot.motivo}</td>

                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(mot.id)}>Atualizar</Button>{' '}
                                     <Button variant="danger" disabled={auth.user.level < 5} onClick={() => deletarMotivo(mot.motivo, mot.id)}>Excluir</Button>{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>



        </div>
    )
}

export default Motivo;