import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


export const NotFound = ()=>{
    const navigate = useNavigate()

    return(
        <div>
            <h2>Você não tem permissão para acessar esta página clique para voltar para a Página Inicial</h2>
            <Button variant="primary" onClick={()=>{navigate('/home')}}>Retornar</Button>

        </div>
    )
}