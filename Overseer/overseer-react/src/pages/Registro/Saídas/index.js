import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

function RegistroSaida(props) {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [idVis, setIdVis] = useState(0);
    const [tipo, setTipo] = useState(0)
    const [cliente, setCliente] = useState('')
    const [procedencia, setProcedencia] = useState('')
    const [cpf, setCpf] = useState('')
    const [placa, setPlaca] = useState('')
    const [nFiscal, setNFiscal] = useState('')
    const [dados, setDados] = useState([])
    const token = sessionStorage.getItem('authToken')
    
    useEffect(() => {
        buscarVistantes()
    }, [])

    const buscarVistantes = async () => {
        const response = await api.get('/saidas', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err =>alert(err.response.data))
        const data = await response.data
        setDados(data)
    }
    const submit = (e) => {
        e.preventDefault()
        const visitante = {
            id: id,
            nome: nome,
            nascimento: nascimento,
            cpf: cpf,
            telefone: telefone,
            email: email
        }
        if (id === 0) {
            inserirVisitante(visitante)
        } else {
            atualizaVisitante(visitante)
        }
        fecharModal()
        //window.location.reload() 
    }

    const inserirVisitante = async (visitante) => {
        const res = window.confirm('Deseja cadastrar o visitante?')
        if (res === true) {
            await api.post('/visitantes', visitante).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }
    const atualizaVisitante = async (visitante) => {
        const res = window.confirm('Deseja alterar as informações deste visitante?')
        if (res === true) {
            await api.post('/visitantes', visitante).then(response => {
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
    const deletarVisitante = async (nome, id) => {
        const res = window.confirm(`Deseja excluir o visitante ${id} - ${nome} `)
        if (res === true) {
            await api.delete(`/visitantes/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarVistantes()
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
        const response = await api.post(`/visitantes/${id}`)
        const data = await response.data
        data.map((vis, index) =>(
            setId(vis.id)
            , setNome(vis.nome)
            , setNascimento(vis.nascimento)
            , setCpf(vis.cpf)
            , setTelefone(vis.telefone)
            , setEmail(vis.email) 
    ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setNome('')
        setNascimento('')
        setCpf('')
        setTelefone('')
        setEmail('')


    }
    const abrirModal = () => {
        setModalAberta(true)
    }

    return (
        <div className='Pag'>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do Visitante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" disabled value={id} readOnly={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control type="text" placeholder="Digite o CPF do visitante" value={cpf} onChange={(e) => { setCpf(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" placeholder="Digite o nome do visitante" value={nome} onChange={(e) => { setNome(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Nascimento</Form.Label>
                            <Form.Control type="date" placeholder="Digite o nome do visitante" value={nascimento} onChange={(e) => { setNascimento(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control type="text" placeholder="Digite o telefone do visitante" value={telefone} onChange={(e) => { setTelefone(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Digite o email do visitante" value={email} onChange={(e) => { setEmail(e.target.value) }} />
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
            <Table striped bordered hover >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CPF</th>
                        <th>Nome Visitante</th>
                        <th>telefone</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        [...dados].map((vis, index) =>
                            <tr key={index}>
                                <td>{vis.id}</td>
                                <td>{vis.cpf}</td>
                                <td>{vis.nome}</td>
                                <td>{vis.telefone}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(vis.id)}>Atualizar</Button>{' '}
                                    <Button variant="danger" onClick={() => deletarVisitante(vis.nome, vis.id)}>Excluir</Button>{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>



        </div>
    )
}

export default RegistroSaida;