
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal, Table, Toast } from 'react-bootstrap';
import Select from 'react-select';
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import { InitialDatetime } from '../../../hooks/initialDatetime';
import { api } from '../../../hooks/useApi';


export const RegistroSaida = () => {
    const [modalPrincipal, setModalPrincipal] = useState(false);
    const [id, setId] = useState(0);
    const [idMotorista, setIdMotorista] = useState(0);//Modal Principal
    const [dataEntrada, setDataEntrada] = useState(InitialDatetime);
    const [tipo, setTipo] = useState(0);// Modal Principal
    const [cliente, setCliente] = useState(0); // Modal Principal
    const [procedencia, setProcedencia] = useState('');
    const [observacao, setObservacao] = useState('');
    const [notaFiscal, setNotaFiscal] = useState(''); 
    const [placa, setPlaca] = useState(''); 

    const [clienteOptions, setClienteOptions] = useState([]);
    const [motoristaOptions, setMotoristaOptions] = useState([]);
    const [dadosStatus, setDadosStatus] = useState([]);
    const [dadosTipo, setDadosTipos] = useState([]);
    
    const [status, setStatus] = useState(1);
    const [busca, setBusca] = useState('');
    const [dados, setDados] = useState([]);
    const [showA, setShowA] = useState(false)
    const [dadosFiltrados, setDadosFiltrados] = useState([])

    const token = sessionStorage.getItem('authToken');
    const auth = useContext(AuthContext);


    const submit = () => {
        const Saida = {
            id: id,
            tipo: tipo,
            cliente: cliente,
            procedencia: procedencia,
            motorista: idMotorista,
            dataEntrada: dataEntrada,
            notaFiscal: notaFiscal,
            placa: placa,
            observacao : observacao,
            idUsuario: auth.user.id,

            
        }
        if (id === 0) {
            cadastraRegistroSaida(Saida)
        } else {
            atualizaRegistroSaida(Saida)
        }
    }
    const buscarRegistroSaida = async () => {
        await api.get('/registroSaida', {
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

    const cadastraRegistroSaida = (saida) => {
        api.post('/registroSaida', saida).then(response => {
            if (response.status === 200) {
                fecharModal()
                window.location.reload()
            }
        }).then(err => { alert(err.response.data) })
    }
    const atualizaRegistroSaida = (saida) => {
        api.post('/registroSaida', saida).then(response => {
            if (response.status === 200) {
                fecharModal()
            }
        }).catch(err => { alert(err.response.data) })
    }
    //Início Modal
    const abrirModal = () => {
        setModalPrincipal(true)
    }
    const fecharModal = () => {
        setModalPrincipal(false)
        setId(0)
        setTipo(0)
        setIdMotorista(0)
        setDataEntrada(InitialDatetime)
        setCliente(0)
        setPlaca('')
        setProcedencia('')
        setNotaFiscal('')
        setObservacao('')
        
    }

    const buscarCliente = async () => {
        const response = await api.get('/clientes', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then()
            .catch(err => { alert(err.response.data) })
        const data = await response.data
        setClienteOptions(data)
    }
    const optionsCliente = clienteOptions.map((cliente) => ({
        value: cliente.id,
        label: `${cliente.id} - ${cliente.cliente}`,
    }));

    const buscarMotoristas = async () => {
        const response = await api.get('/motorista', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then()
            .catch(err => { alert(err.response.data) })
        const data = await response.data
        setMotoristaOptions(data)
    }
    const optionsMotorista = motoristaOptions.map((motorista) => ({
        value: motorista.id,
        label: `${motorista.NomeMotorista} - ${motorista.cpfMotorista}`,
    }));

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
    const buscaTipo = async () => {
        const response = await api.get('/tipoS', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then()
            .catch(err => { alert(err.response.data) })
        setDadosTipos(response.data);
    }

    useEffect(() => {
        buscarRegistroSaida()
        buscarStatus()
        buscaTipo()
        buscarCliente()
        buscarMotoristas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buscarSaidas = async () => {
        await api.post('/registroSaidas', {
            status: status
        }).then(response => {
            setDados(response.data)
        }).catch(err => { alert(err.response.data) })
    }
    const toggleShowA = () => { setShowA(!showA) }



    const encerrarRegistro = async (nome, id) => {
        const res = window.confirm(`Deseja encerrar a saída ${id} - ${nome} `)

        if (res === true) {
            //const resp = window.prompt('Informe alguma observação sobre o processo da visita')

            await api.post(`/encerrarSaida/${id}`, ).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarRegistroSaida()
                    window.location.reload()
                }
            }).catch(err => {
                alert(err.response.data)
            })
        } else {
            window.location.reload()
        }
    }
    const cancelarRegistro = async (nome, id) => {
        const res = window.confirm(`Deseja Cancelar a Saída? ${id} - ${nome} `)
        if (res === true) {
            const resp = window.prompt('Informe o motivo do cancelamento da Saída')
            await api.post(`/cancelarSaida/${id}`, { observacao: resp }).then(response => {
                if (response.status === 200) {
                    alert(response.data)
                    buscarRegistroSaida()
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
            <div><Form.Label>Movimentos - Saidas</Form.Label></div>
            <Modal fullscreen={true} show={modalPrincipal} onHide={fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Registro de Entrada</Modal.Title>
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

                        <Form.Group className="mb-3" id="Tipo">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select onChange={e => { setTipo(e.target.value) }} >
                                <option value={0}>Selecione</option>
                                {[...dadosTipo].map((tipo, index) => (
                                    <option key={index} value={tipo.id} >
                                        {tipo.tipo}
                                    </option>))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" id="Visita">
                            <Form.Label>Entrada</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={dataEntrada}
                                onChange={e=>{setDataEntrada(e.target.value)}}
                               
                            />

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Cliente">
                            <Form.Label>Cliente</Form.Label>
                            <Select options={optionsCliente} onChange={e => { setCliente(e.value) }} />
                            {/*na função onChange é utilizado apenas e.value por conta da função options, não segue a logica */}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="NomeMotorista">
                            <Form.Label>Motorista</Form.Label>
                            <Select options={optionsMotorista} onChange={e => { setIdMotorista(e.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Placa</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={placa}
                                    onChange={e => {setPlaca(e.target.value.toUpperCase())}}
                                    placeholder="Placa do Veículo"
                                    autoComplete="off"
                                    toUpperCase
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Procedência</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={procedencia}
                                    onChange={e => {setProcedencia(e.target.value.toUpperCase())}}
                                    placeholder="Cidade de Origem da Empresa"
                                    autoComplete="off"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Nota Fiscal</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={notaFiscal}
                                    onChange={e => {setNotaFiscal(e.target.value)}}
                                    placeholder="Digite se possuir nota fiscal"
                                    autoComplete="off"
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Observação</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    value={observacao}
                                    onChange={e => {setObservacao(e.target.value)}}
                                    placeholder="Assuntos e demais observações"
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
            <Button id="basic-addon1" onClick={buscarSaidas}>Buscar</Button>

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
                        <th>Tipo</th>
                        <th>Cliente</th>
                        <th>Motorista</th>
                        <th>Data de Entrada</th>
                        <th>Data de Saída</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dadosFiltrados.map((sai, index) =>
                            <tr key={index}>
                                <td>{sai.id}</td>
                                <td>{sai.status}</td>
                                <td>{sai.tipo}</td>
                                <td>{sai.cliente}</td>
                                <td>{sai.motorista}</td>
                                <td>{sai.entrada}</td>
                                <td>{sai.saida}</td>
                                <td>

                                    <Button
                                        variant="success"
                                        onClick={() => encerrarRegistro(sai.nome, sai.id)}
                                        disabled={sai.status !== 'Aberto'}
                                    >
                                        Encerrar
                                    </Button>{' '}
                                    <Button
                                        variant="danger"
                                        onClick={() => cancelarRegistro(sai.nome, sai.id)}
                                        disabled={sai.status !== 'Aberto'}
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
                                            <strong className="me-auto">Saída: {sai.nome}</strong>
                                        </Toast.Header>
                                        
                                        <Toast.Body>Observação de Entrada: {sai.assunto}</Toast.Body>
                                        <Toast.Body>procedencia: {sai.procedencia}</Toast.Body>
                                        <Toast.Body>Placa: {sai.placa}</Toast.Body>
                                        <Toast.Body>Nota Fiscal: {sai.notafiscal}</Toast.Body>
                                        <Toast.Body>Observação de Saída: {sai.obs}</Toast.Body>
                                        
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

