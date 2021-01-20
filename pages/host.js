import {useState, useEffect} from 'react'
import api from './api'


const buy_api = 'http://localhost:5000/buy'
function send(event,paridade, expiracao, tipo, direcao){
    event.preventDefault()
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            paridade: paridade,
            expiracao: expiracao,
            tipo: tipo,
            direcao: direcao,
        })
    }

    fetch(buy_api, reqOptions)
        .then(response => response.json())
        .then(data => console.log(data))
}

export default function Host(){
    const [ativos, setAtivos] = useState([''])
    const [paridade, setParidade] = useState()
    const [expiracao, setExpiracao] = useState()
    const [tipo, setTipo] = useState()
    const [direcao, setDirecao] = useState()

    useEffect(()=>{
        async function loadData(){
            const response = await fetch('http://localhost:5000/paridades')
            const paridades = await response.json()
            setAtivos(paridades)
        }
        loadData()
    }, [])
    console.log(ativos.paridades)    
    return(
        <div id='host'>
            <div className='container'>
                <div>
                    <p>Paridade</p>
                    <select onChange={(event)=>setParidade(event.target.value)}>
                        <option value="" selected disabled hidden>Escolha o ativo</option>
                        {   
                            ativos.paridades &&
                            ativos.paridades.map((ativo) => {
                                return(
                                    <option>{ativo}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div>
                    <p>Direção</p>
                    <select 
                    defaultValue
                    onChange={(event)=>setDirecao(event.target.value)}>
                        <option selected>BAIXO</option>
                        <option>CIMA</option>
                    </select>
                </div>
                
                <div>
                    <p>Expiração</p>
                    <input
                    onChange={(event)=>setExpiracao(event.target.value)} 
                    placeholder='Minutos' min={1} type='number'/>
                </div>

                <div>
                    <p>Tipo</p>
                    <select onChange={(event)=>setTipo(event.target.value)}>
                        <option selected>BINÁRIA</option>
                        <option>DIGITAL</option>
                    </select>
                </div>
                
                <button onClick={(event)=>send(event, paridade, expiracao, tipo, direcao)}>ENVIAR</button>
                
            </div>
            
        </div>
    )
}