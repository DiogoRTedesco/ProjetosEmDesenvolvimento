import { useEffect, useState } from "react"
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap'
import { api } from "../../../hooks/useApi"
export const Perfil = (props) => {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0)
    const [nomePerfil, setNomePerfil] = useState('')
    const [valorPerfil, setValorPerfil] = useState(0)
    const [dados, setDados] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')
    
    useEffect(() => {
        carregarPerfil()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const carregarPerfil = async () => {
        const result = await api.get('/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err => alert(err.response.data))
        const data = await result.data
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

    const submit = async (e) => {
        e.preventDefault()
        const perfil = {
            id: id,
            nomePerfil: nomePerfil,
            valorPerfil: valorPerfil,
        }
        if (id === 0) {
            inserirPerfil(perfil)
        } else {
            atualizaPerfil(perfil)
        }
        fecharModal();
        //window.location.reload()
    }

    const inserirPerfil = async (perfil) => {
        const res = window.confirm('Deseja criar o perfil?')
        if (res === true) {
            await api.post('/perfil', perfil).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => { alert(err.response.data) })
        } else {
            fecharModal()
        }
    }
    const atualizaPerfil = async (perfil) => {
        const res = window.confirm('Deseja atualizar as informações deste perfil?')
        if (res === true) {
            await api.post('/perfil', perfil).then(response => {
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

    const deletarPerfil = async (perfil, id) => {
        const res = window.confirm(`Deseja excluir o perfil ${id} - ${perfil} ?`)
        if (res === true) {
            const response = await api.delete(`/usuario/${id}`)
            if (response.status === 200) {
                carregarPerfil()
                window.location.reload()
            }
        } else {
            window.location.reload()
        }
    }
    const carregarDados = async (id) => {
        const response = await api.post(`/perfil/${id}`)
        const data = await response.data
        data.map((per, index) => (
            setId(per.id)
            ,setNomePerfil(per.NomePerfil)
            ,setValorPerfil(per.ValorPerfil)
        ))
        abrirModal()
    }

    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setNomePerfil('')
        setValorPerfil(0)

    }
    const abrirModal = () => {
        setModalAberta(true)
    }
    return (
        <div className="Pag">
            <div><Form.Label>Cadastros - Perfil</Form.Label></div>
            <Modal show={modalAberta} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Id</Form.Label>
                            <Form.Control type="text" disabled placeholder="ID" value={id} onChange={e => { setId(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Nome do Perfil</Form.Label>
                            <Form.Control type="text" placeholder="Nome" value={nomePerfil} onChange={e => { setNomePerfil(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Tipo de Perfil</Form.Label>
                            <Form.Select onChange={e => { setValorPerfil(e.target.value) }} >
                                <option value={valorPerfil}>{valorPerfil}</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>

                            </Form.Select>
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
                        <th>Nome do Perfil</th>
                        <th>Valor do Perfil</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((perfil, index) =>
                            <tr key={index}>
                                <td>{perfil.id}</td>
                                <td>{perfil.NomePerfil}</td>
                                <td>{perfil.ValorPerfil}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(perfil.id)}>Atualizar</Button>{' '}
                                    <Button variant="danger" onClick={() => deletarPerfil(perfil.nome, perfil.id)}>Excluir</Button>{' '}
                                </td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>
        </div>
    )
}