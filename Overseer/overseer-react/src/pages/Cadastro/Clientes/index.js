import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

function Cliente(props) {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [cliente, setCliente] = useState('')
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    
    const token = sessionStorage.getItem('authToken')
    const auth = useContext(AuthContext)

    useEffect(() => {
        buscarCliente()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarCliente = async () => {
        const response = await api.get('/clientes', {
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
        const clientes = {
            id: id,
            cliente: cliente,
        }
        if (id === 0) {
            inserirCliente(clientes)
        } else {
            atualizaCliente(clientes)
        }
        fecharModal()
        //window.location.reload() 
    }

    const inserirCliente = async (cliente) => {
        const res = window.confirm('Deseja cadastrar o cliente?')
        if (res === true) {
            await api.post('/clientes', cliente).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }

    const atualizaCliente = async (cliente) => {
        const res = window.confirm('Deseja alterar as informações deste cliente?')
        if (res === true) {
            await api.post('/clientes', cliente).then(response => {
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
    const deletarCliente = async (cliente, id) => {
        const res = window.confirm(`Deseja excluir o cliente ${id} - ${cliente} `)
        if (res === true) {
            await api.delete(`/clientes/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarCliente()
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
        const response = await api.post(`/clientes/${id}`)
        const data = await response.data
        data.map((cli, index) => (
            setId(cli.id)
            // eslint-disable-next-line no-sequences
            , setCliente(cli.cliente)

        ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setCliente('')
    }
    const abrirModal = () => {
        setModalAberta(true)
    }

    return (
        <div className='Pag'>
            <div><Form.Label>Cadastros - Cliente</Form.Label></div>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do Cliente / Fornecedor </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" disabled value={id} readOnly={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Control type="text" placeholder="Digite o nome do cliente" value={cliente} onChange={(e) => { setCliente(e.target.value) }} />
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
                    placeholder="Digite o nome do cliente"
                    aria-label="Digite o nome do cliente"
                    aria-describedby="basic-addon1"
                    value={busca}
                    onChange={(e)=> setBusca(e.target.value)}
                />
            </InputGroup>
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((cli, index) =>
                            <tr key={index}>
                                <td>{cli.id}</td>
                                <td>{cli.cliente}</td>

                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(cli.id)}>Atualizar</Button>{' '}
                                    {auth.user.level >= 5 && <Button variant="danger" onClick={() => deletarCliente(cli.cliente, cli.id)}>Excluir</Button>}{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>



        </div>
    )
}

export default Cliente;