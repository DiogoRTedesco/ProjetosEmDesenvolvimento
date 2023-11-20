import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { api } from '../../../hooks/useApi';
// import { Container } from './styles';

function Empresa(props) {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0);
    const [empresa, setEmpresa] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')
    
    useEffect(() => {
        buscarEmpresas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarEmpresas = async () => {
        const response = await api.get('/empresas', {
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
        const empresas = {
            id: id,
            empresa:empresa,
            cnpj:cnpj
        }
        if (id === 0) {
            inserirEmpresa(empresas)
        } else {
            atualizaEmpresa(empresas)
        }
        fecharModal()
        //window.location.reload() 
    }

    const inserirEmpresa = async (empresa) => {
        const res = window.confirm('Deseja cadastrar a empresa?')
        if (res === true) {
            await api.post('/empresas', empresa).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }

    const atualizaEmpresa = async (empresa) => {
        const res = window.confirm('Deseja alterar as informações desta Empresa?')
        if (res === true) {
            await api.post('/empresas', empresa).then(response => {
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
    const deletarEmpresa = async (empresa, id) => {
        const res = window.confirm(`Deseja excluir a Empresa ${id} - ${empresa} `)
        if (res === true) {
            await api.delete(`/empresas/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarEmpresas()
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
        const response = await api.post(`/empresas/${id}`)
        const data = await response.data
        data.map((emp, index) =>(
            setId(emp.id)
            // eslint-disable-next-line no-sequences
            , setEmpresa(emp.empresa)
            , setCnpj(emp.cnpj)
           
    ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setEmpresa('')
        setCnpj('')
    }
    const abrirModal = () => {
        setModalAberta(true)
    }

    return (
        <div className='Pag'>
            <div><Form.Label>Cadastros - Empresa</Form.Label></div>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados da Empresa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" disabled value={id} readOnly={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Control type="text" placeholder="Digite o nome da empresa" value={empresa} onChange={(e) => { setEmpresa(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Cnpj</Form.Label>
                            <Form.Control type="text" placeholder="Digite o cnpj" value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />
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
                        <th>Empresa</th>
                        <th>Cnpj</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((emp, index) =>
                            <tr key={index}>
                                <td>{emp.id}</td>
                                <td>{emp.empresa}</td>
                                <td>{emp.cnpj}</td>

                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(emp.id)}>Atualizar</Button>{' '}
                                    <Button variant="danger" onClick={() => deletarEmpresa(emp.empresa, emp.id)}>Excluir</Button>{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>



        </div>
    )
}

export default Empresa;