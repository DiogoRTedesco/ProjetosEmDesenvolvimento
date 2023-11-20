import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

function Fornecedor(props) {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [fornecedor, setFornecedor] = useState('')
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')
    
    useEffect(() => {
        buscarFornecedores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarFornecedores = async () => {
        const response = await api.get('/fornecedores', {
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
        const fornecedores = {
            id: id,
            fornecedor:fornecedor,
            
        }
        if (id === 0) {
            inserirfornecedor(fornecedores)
        } else {
            atualizafornecedor(fornecedores)
        }
        fecharModal()
        //window.location.reload() 
    }

    const inserirfornecedor = async (fornecedor) => {
        const res = window.confirm('Deseja cadastrar a fornecedor?')
        if (res === true) {
            await api.post('/fornecedors', fornecedor).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }

    const atualizafornecedor = async (fornecedor) => {
        const res = window.confirm('Deseja alterar as informações desta fornecedor?')
        if (res === true) {
            await api.post('/fornecedores', fornecedor).then(response => {
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
    const deletarFornecedor = async (fornecedor, id) => {
        const res = window.confirm(`Deseja excluir a fornecedor ${id} - ${fornecedor} `)
        if (res === true) {
            await api.delete(`/fornecedores/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarFornecedores()
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
        const response = await api.post(`/fornecedors/${id}`)
        const data = await response.data
        data.map((forn, index) =>(
            setId(forn.id)
            // eslint-disable-next-line no-sequences
            , setFornecedor(forn.fornecedor)
            
           
    ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setFornecedor('')
        
    }
    const abrirModal = () => {
        setModalAberta(true)
    }

    return (
        <div className='Pag'>
            <div><Form.Label>Cadastros - Fornecedor</Form.Label></div>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do Fornecedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" disabled value={id} readOnly={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Fornecedor</Form.Label>
                            <Form.Control type="text" placeholder="Digite o nome do Fornecedor" value={fornecedor} onChange={(e) => { setFornecedor(e.target.value) }} />
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
                        <th>Fornecedor</th>
                        
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((forn, index) =>
                            <tr key={index}>
                                <td>{forn.id}</td>
                                <td>{forn.fornecedor}</td>
                                

                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(forn.id)}>Atualizar</Button>{' '}
                                    <Button variant="danger" onClick={() => deletarFornecedor(forn.fornecedor, forn.id)}>Excluir</Button>{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>



        </div>
    )
}

export default Fornecedor;