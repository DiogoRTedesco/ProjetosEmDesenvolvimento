import { useEffect, useState } from "react"
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap'
import { api } from "../../../hooks/useApi"
export const Usuario = (props) => {
    const [modalAberta, setModalAberta] = useState(false)
    const [id, setId] = useState(0)
    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [perfil, setPerfil] = useState(0)
    const [ativo, setAtivo] = useState(true)
    const [dados, setDados] = useState([])
    const [dadosPerfil, setDadosPerfil] = useState([])
    const [busca, setBusca] = useState('')
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken')

    useEffect(() => {
        buscarUsuarios();
    }, [])

    useEffect(() => {
        carregarPerfil();
    }, [])

    const carregarPerfil = async () => {

        const result = await api.get('/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err => alert(err.response.data))
        const data = await result.data
        setDadosPerfil(data)
    }
    useEffect(() => {
        const filtrados = dados.filter((item) => {
            const valores = Object.values(item).join(' ').toLowerCase();
            const termoBusca = busca.toLowerCase().trim();
            return valores.includes(termoBusca);
        })
        setDadosFiltrados(filtrados)
      }, [busca, dados])
    const submit = async () => {
        const user = {
            id: id,
            usuario: usuario,
            password: password,
            perfil: perfil,
            nome: nome,
            email: email,
            ativo: ativo
        }
        if (id === 0) {
            inserirUsuario(user)
        } else {
            atualizaUsuario(user)
        }
        fecharModal();
        //window.location.reload()
    }
    const inserirUsuario = async (user) => {
        const res = window.confirm('Deseja criar o usuário?')
        if (res === true) {
            await api.post('/usuarios', user,).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => alert(err.response.data))
        } else {
            fecharModal()
        }

    }
    const atualizaUsuario = async (user) => {
        const res = window.confirm('Deseja atualizar as informações a seguir? ')
        if (res === true) {
            await api.post('/usuarios', user).then(response => {
                alert(response.data)
                window.location.reload()
            }).catch(err => alert(err.response.data))
        } else {
            fecharModal()
        }

    }
    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setUsuario('')
        setPassword('')
        setNome('')
        setEmail('')
        setPerfil(0)

    }
    const abrirModal = () => {
        setModalAberta(true)
    }
    const buscarUsuarios = async () => {
        const response = await api.get('/usuarios', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err => alert(err.response.data))
        const data = await response.data
        setDados(data)


    }
    const deletarUsuario = async (nome, id) => {
        const res = window.confirm(`Deseja excluir o usuário ${id} - ${nome} `)
        if (res === true) {
            await api.delete(`/usuarios/${id}`).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarUsuarios()
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
        const response = await api.post(`/usuarios/${id}`).then().catch(err => alert(err.response.data))
        const data = await response.data
        data.map((usr, index) => (
            setId(usr.id)
            , setUsuario(usr.usuario)
            , setPassword(usr.senha)
            , setNome(usr.nome)
            , setEmail(usr.email)
            , setPerfil(usr.perfil)
        ))
        abrirModal()
    }



    return (
        <div className="Pag">
            <div><Form.Label>Cadastros - Usuário</Form.Label></div>
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
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" placeholder="Nome" value={nome} onChange={e => { setNome(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Nome do usuário</Form.Label>
                            <Form.Control type="text" placeholder="Usuario" value={usuario} onChange={e => { setUsuario(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="Digite sua senha" value={password} onChange={e => { setPassword(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Digite seu Email" value={email} onChange={e => { setEmail(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Perfil</Form.Label>
                            <Form.Select onChange={e => { setPerfil(e.target.value) }} >
                                <option value={0}>Selecione</option>

                                {[...dadosPerfil].map((perfil, index) => (
                                    <option key={index} value={perfil.id} >
                                        {perfil.NomePerfil}
                                    </option>))}

                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                required
                                checked={ativo}
                                onChange={e => { setAtivo(e.target.checked) }}
                                label="Ativo"
                                feedback="You must agree before submitting."
                                feedbackType="invalid"
                            />

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
                        <th>Usuário</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((user, index) =>
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.usuario}</td>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>{user.NomePerfil}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => carregarDados(user.id)}>Atualizar</Button>{' '}
                                    <Button variant="danger" onClick={() => deletarUsuario(user.usuario, user.id)}>Excluir</Button>{' '}</td>
                            </tr>

                        )
                    }


                </tbody>
            </Table>




        </div>
    )


}