import { PDFViewer } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { PDFDocument } from '../../../PDF/RecebimentosPDF';
import { api } from '../../../hooks/useApi';



export const RelatorioEntrada = () => {
    const [dados, setDados] = useState([]);
    const [entrada, setEntrada] = useState('');
    const [saida, setSaida] = useState('');
    const [status, setStatus] = useState(0);
    const [show, setShow] = useState(false)
    const [dadosStatus, setDadosStatus] = useState([]);
    const token = sessionStorage.getItem('authToken')
    
    const buscarRegistroEntradas = async () => {
        await api.post('/relatorioRecebimentos', {
            entrada: entrada,
            saida: saida,
            status: status
        }
        )
            .then(response => {
                setDados(response.data)
                setShow(true)
                console.log()

            }).catch(err => {
                alert(err.response.data)
            })
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
        console.log(entrada.replace(/-/g, ""))
    }, [entrada])
    useEffect(() => {
        buscarStatus()
    }, [])
    return (
        <div className='Rel'>
            <Form >
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Data de Entrada</Form.Label>
                    <Form.Control
                        type="date"
                        value={entrada}
                        onChange={e => { setEntrada(e.target.value) }}
                    />
                    <Form.Label>Data de Saída</Form.Label>
                    <Form.Control
                        type="date"
                        value={saida}
                        onChange={e => { setSaida(e.target.value) }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Status</Form.Label>
                    <Form.Select onChange={e => { setStatus(e.target.value) }} >

                        {dadosStatus.map((status, index) => (
                            <option key={index} value={status.id} >
                                {status.status}
                            </option>))}
                        <option value={0}>Todos</option>

                    </Form.Select>

                </Form.Group>

                <Button onClick={buscarRegistroEntradas}>Buscar</Button>
            </Form>

            <div style={{display:  show === false ? 'none': 'block'}}>
                <h1>Relatório de Entradas : Período : {entrada.replace(/-/g, "/")} - {saida.replace(/-/g, "/")}</h1>
                <PDFViewer width="100%" height="600" fileName="Relatório de Visitantes.pdf">
                    <PDFDocument data={dados} />
                </PDFViewer>
                {/*<PDFDownloadLink document={<PDFDocument data={dados} />} fileName="Relatório de Visitantes.pdf">
                    {({ blob, url, loading, error }) =>
                        loading ? 'Carregando documento...' : 'Baixar PDF'
                    }
                </PDFDownloadLink>*/}
            </div>
        </div>
    )
}