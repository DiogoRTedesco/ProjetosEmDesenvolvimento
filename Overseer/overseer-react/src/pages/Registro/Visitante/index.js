import React, { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal, Table, Toast } from 'react-bootstrap';
import Select from 'react-select';
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import { InitialDatetime } from '../../../hooks/initialDatetime';
import { api } from '../../../hooks/useApi';



export const RegistroVisitantes = () => {
    const [modalAberta, setModalAberta] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState(0);
    const [idVisitante, setIdVisitante] = useState(0);
    const [telefone, setTelefone] = useState('');
    const [dataEntrada, setDataEntrada] = useState(InitialDatetime);
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
            dataEntrada: dataEntrada,
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
    
    const fecharModal = () => {
        setModalAberta(false)
        setId(0)
        setIdVisitante(0)
        setDataEntrada(InitialDatetime)
        setEmpresa('')
        setMotivo('')
        setVisitado('')
        
    }
    //Fim Modal
    const buscarVisitante = async () => {
        const response = await api.get('/visitantes', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then()
            .catch(err => { alert(err.response.data) })
        const data = await response.data
        setVisitante(data)
    }
    const optionsVisitante = visitante.map((visitante) => ({
        value: visitante.id,
        label: `${visitante.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')} - ${visitante.nome}`,
    }));

   
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
        buscarVisitante()
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

        <div className='Pag'>
             <div><Form.Label>Movimentos - Visitantes</Form.Label></div>
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
                                type="datetime-local"
                                value={dataEntrada}
                                onChange={e=>{setDataEntrada(e.target.value)}}
                               
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Visitante">
                            <Form.Label>Visitante</Form.Label>
                            <Select options={optionsVisitante} onChange={e => { setIdVisitante(e.value) }} />
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
                                <td>{reg.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')}</td>
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
    )
}


