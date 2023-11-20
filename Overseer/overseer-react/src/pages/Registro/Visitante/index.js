import React, { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal, Spinner, Table, Toast } from 'react-bootstrap';
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import { api } from '../../../hooks/useApi';



export const RegistroVisitantes = () => {
    const [modalAberta, setModalAberta] = useState(false);
    const [modalVisitante, setModalVisitante] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState(0);
    const [idVisitante, setIdVisitante] = useState(0);
    const [nome, setNome] = useState('');
    const [nomeVisitante, setNomeVisitante] = useState('');
    const [cpfVisitante, setCpfVisitante] = useState('');
    const [cpf, setCpf] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataEntrada, setDataEntrada] = useState('');
    //const [dataSaida, setDataSaida] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [motivo, setMotivo] = useState('');
    const [visitado, setVisitado] = useState('');
    const [status, setStatus] = useState(1);
    const [busca, setBusca] = useState('')
    const [dados, setDados] = useState([]);
    const [dadosMotivo, setDadosMotivo] = useState([]);
    const [dadosEmpresa, setDadosEmpresa] = useState([]);
    const [dadosStatus, setDadosStatus] = useState([]);
    const [visitante, setVisitante] = useState([]);
    const [showA, setShowA] = useState(false)
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const token = sessionStorage.getItem('authToken');
    const auth = useContext(AuthContext);


    const submit = () => {
        const visitante = {
            id: id,
            idVisitante: idVisitante,
            dataEntrada: 'getDate()',
            empresa: empresa,
            motivo: motivo,
            visitado: visitado,
            idUsuario: auth.user.id,
            dataSaida: 'getdate()',


        }
        if (id === 0) {
            cadastraRegistroVisita(visitante)
        } else {
            atualizaRegistroVisita(visitante)
        }
    }
    const buscarRegistroVisitantes = async () => {
        await api.get('/registrovisita', {
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
        const filtrados = dados.filter((item) => {
            const valores = Object.values(item).join(' ').toLowerCase();
            const termoBusca = busca.toLowerCase().trim();
            return valores.includes(termoBusca);
        })
        setDadosFiltrados(filtrados)
    }, [busca, dados])

    const cadastraRegistroVisita = (visita) => {
        api.post('/registroVisita', visita).then(response => {
            if (response.status === 200) {
                fecharModal()
                window.location.reload()
            }
        }).then(err => { alert(err.response.data) })
    }
    const atualizaRegistroVisita = (visita) => {
        api.post('/registroVisita', visita).then(response => {
            if (response.status === 200) {
                fecharModal()
            }
        }).catch(err => { alert(err.response.data) })
    }
    //Início Modal
    const abrirModal = () => {
        setModalAberta(true)
    }
    const abrirModalVisitatne = () => {
        setModalVisitante(true)
    }
    const fecharModalVisitante = () => {
        setModalVisitante(false)
        setCpf('')
        setNome('')
        setNascimento('')
        setEmail('')
    }
    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setNomeVisitante('')
        setCpfVisitante('')
        setIdVisitante(0)
        setDataEntrada('')
        setEmpresa('')
        setMotivo('')
        setVisitado('')
        setIsLoading(false)
    }
    //Fim Modal
    const buscarCpf = async () => {
        await api.post('/visitante', {
            cpf: cpfVisitante
        }).then(response => {
            if (response.status === 200) {
                const data = response.data
                setVisitante(data)

            } else {
                const res = window.confirm('Visitante não cadastrado deseja cadastrar?')
                if (res === true) {
                    abrirModalVisitatne()
                }
            }
        }).catch(err => { alert(err.response.data) })
    }
    useEffect(() => {
        visitante.map((vis, index) => (
            // eslint-disable-next-line no-sequences
            setNomeVisitante(vis.nome),
            setIdVisitante(vis.id),
            setDataEntrada(vis.dataEntrada)
        )
        )
    }, [visitante])

    const submitVisitante = () => {
        const visitante = {
            nome: nome,
            cpf: cpf,
            nascimento: nascimento,
            telefone: telefone,
            email: email
        }
        if (nome.length > 0 && cpf.length > 0) {
            const res = window.confirm('Deseja cadastrar o visitante?')
            if (res === true) {
                api.post('/visitantes', visitante).then(response => {
                    if (response.status === 200) {
                        const data = response.data
                        alert(data)
                        fecharModalVisitante()
                    }
                }).catch(err => {
                    alert(err.response.data)
                })
            }
        } else {
            alert('Preencha todos os campos')
        }

    }
    const buscarEmpresas = async () => {
        const response = await api.get('/empresas', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then().catch(err => alert(err.response.data))
        const data = await response.data
        setDadosEmpresa(data)
    }

    const buscarMotivos = async () => {
        const response = await api.get('/motivos',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then()
            .catch(err => { alert(err.response.data) })
        const data = await response.data
        setDadosMotivo(data)
    }
    const buscarStatus = async () => {
        const response = await api.get('/status', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then()
            .catch(err => { alert(err.response.data) })
        setDadosStatus(response.data)
    }
    useEffect(() => {
        buscarMotivos()
        buscarEmpresas()
        buscarRegistroVisitantes()
        buscarStatus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarAtendimentos = async () => {
        await api.post('/registroVisitas', {
            status: status
        }).then(response => {
            setDados(response.data)
        }).catch(err => { alert(err.response.data) })
    }
    const toggleShowA = () => { setShowA(!showA) }

    /*const carregarDados = async (id) => {
        const response = await api.post(`/123/${id}`).then().catch(err => { alert(err.response.data) })
        const data = await response.data
        data.map((vis) => (
            setId(vis.id)
            , setNome(vis.nome)
            , setDataEntrada(vis.nascimento)
            , setCpf(vis.cpf)
            , setEmpresa(vis.telefone)

        ))
        abrirModal()
    }*/

    const encerrarVisita = async (nome, id) => {
        const res = window.confirm(`Deseja encerrar a visita ${id} - ${nome} `)

        if (res === true) {
            const resp = window.prompt('Informe alguma observação sobre o processo da visita')

            await api.post(`/encerrarVisita/${id}`, { observacao: resp }).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarRegistroVisitantes()
                    window.location.reload()
                }
            }).catch(err => {
                alert(err.response.data)
            })
        } else {
            window.location.reload()
        }
    }
    const cancelarVisita = async (nome, id) => {
        const res = window.confirm(`Deseja encerrar a visita ${id} - ${nome} `)

        if (res === true) {
            const resp = window.prompt('Informe o motivo do cancelamento da visita')
            await api.post(`/cancelarVisita/${id}`, { observacao: resp }).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarRegistroVisitantes()
                    window.location.reload()
                }
            }).catch(err => {
                alert(err.response.data)
            })
        } else {
            window.location.reload()
        }
    }

    return (
        <div>
            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div className='Pag'>
                    <Modal fullscreen={true} show={modalAberta} onHide={fecharModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Registro de Visitantes</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        readOnly
                                        value={id}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Data da Visita</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dataEntrada}
                                        readOnly
                                        onChange={(e) => { setDataEntrada(e.target.value) }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>CPF <strong>*</strong></Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="text"
                                            value={cpfVisitante}
                                            onChange={e => (setCpfVisitante(e.target.value))}
                                            disabled={isLoading}
                                            placeholder="Buscar"
                                            aria-label="Buscar"
                                            aria-describedby="basic-addon2"
                                            autoComplete="off"
                                        />
                                        <Button id="basic-addon1" onClick={buscarCpf}>Buscar</Button>
                                    </InputGroup>

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Nome do visitante"
                                        readOnly
                                        value={nomeVisitante}
                                        autoComplete="off"
                                        onChange={(e) => { setNomeVisitante(e.target.value) }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" id="Empresa">
                                    <Form.Label>Empresa</Form.Label>
                                    <Form.Select onChange={e => { setEmpresa(e.target.value) }} >
                                        <option value={0}>Selecione</option>
                                        {[...dadosEmpresa].map((empresa, index) => (
                                            <option key={index} value={empresa.id} >
                                                {empresa.empresa}
                                            </option>))}

                                    </Form.Select>

                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Motivo</Form.Label>
                                    <Form.Select onChange={e => { setMotivo(e.target.value) }} >
                                        <option value={0}>Selecione</option>
                                        {[...dadosMotivo].map((motivo, index) => (
                                            <option key={index} value={motivo.id} >
                                                {motivo.motivo}
                                            </option>))}

                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Pessoa a ser Visitada</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="text"
                                            value={visitado}
                                            onChange={e => (setVisitado(e.target.value))}
                                            disabled={isLoading}
                                            placeholder="Digite o nome da pessoa que irá receber a visita"
                                            aria-label="Buscar"
                                            aria-describedby="basic-addon2"
                                            autoComplete="off"
                                        />
                                    </InputGroup>
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
                    </Modal >
                    {/* Modal de visitantes */}
                    <Modal show={modalVisitante} onHide={fecharModalVisitante}>
                        <Modal.Header closeButton>
                            <Modal.Title>Cadastro de Visitante</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        readOnly
                                        value={id} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>CPF <strong>*</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o CPF do visitante"
                                        value={cpf}
                                        onChange={(e) => { setCpf(e.target.value) }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Nome <strong>*</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o nome do visitante"
                                        value={nome}
                                        onChange={(e) => { setNome(e.target.value) }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Nascimento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Digite o nome do visitante"
                                        value={nascimento}
                                        onChange={(e) => { setNascimento(e.target.value) }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o telefone do visitante"
                                        value={telefone}
                                        onChange={(e) => { setTelefone(e.target.value) }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Digite o email do visitante"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={fecharModalVisitante}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" onClick={submitVisitante}>
                                Salvar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {/* FIM Modal de visitantes */}
                    <Button variant="warning" type="reset" onClick={abrirModal}>
                        Novo
                    </Button>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Status</Form.Label>
                        <Form.Select onChange={e => { setStatus(e.target.value) }} >

                            {dadosStatus.map((status, index) => (
                                <option key={index} value={status.id} >
                                    {status.status}
                                </option>))}

                        </Form.Select>

                    </Form.Group>
                    <Button id="basic-addon1" onClick={buscarAtendimentos}>Buscar</Button>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Filtro de busca</InputGroup.Text>
                        <Form.Control
                            placeholder="Digite o conteudo de busca"
                            aria-label="Digite o conteudo de busca"
                            aria-describedby="basic-addon1"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </InputGroup>
                    <Table striped bordered hover >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                                <th>CPF</th>
                                <th>Nome Visitante</th>
                                <th>Data de Entrada</th>
                                <th>Data de Saída</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dadosFiltrados.map((reg, index) =>
                                    <tr key={index}>
                                        <td>{reg.id}</td>
                                        <td>{reg.status}</td>
                                        <td>{reg.cpf}</td>
                                        <td>{reg.nome}</td>
                                        <td>{reg.entrada}</td>
                                        <td>{reg.saida}</td>
                                        <td>

                                            <Button
                                                variant="success"
                                                onClick={() => encerrarVisita(reg.nome, reg.id)}
                                                disabled={reg.status !== 'Aberto'}
                                            >
                                                Encerrar
                                            </Button>{' '}
                                            <Button
                                                variant="danger"
                                                onClick={() => cancelarVisita(reg.nome, reg.id)}
                                                disabled={reg.status !== 'Aberto'}
                                            >
                                                Cancelar Visita
                                            </Button>{' '}
                                            <Button onClick={toggleShowA} className="mb-2">
                                                Info Adicionais
                                            </Button>
                                            <Toast show={showA} onClose={toggleShowA}>
                                                <Toast.Header>
                                                    <img
                                                        src="holder.js/20x20?text=%20"
                                                        className="rounded me-2"
                                                        alt=""
                                                    />
                                                    <strong className="me-auto">Visitante: {reg.nome}</strong>
                                                </Toast.Header>
                                                <Toast.Body>Empresa: {reg.empresa}</Toast.Body>
                                                <Toast.Body>Motivo: {reg.motivo}</Toast.Body>
                                                <Toast.Body>Visitado: {reg.visitado}</Toast.Body>
                                            </Toast>

                                        </td>
                                    </tr>

                                )
                            }


                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    )
}