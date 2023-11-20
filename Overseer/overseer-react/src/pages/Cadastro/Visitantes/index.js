/* eslint-disable no-sequences */
import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

function Visitante(props) {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [nome, setNome] = useState('')
    const [nascimento, setNascimento] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')
    
    useEffect(() => {
        buscarVistantes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarVistantes = async () => {
        const response = await api.get('/visitantes', {
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
                        <th>CPF</th>
                        <th>Nome Visitante</th>
                        <th>telefone</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        
                        dadosFiltrados.map((vis, index) =>
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

export default Visitante;