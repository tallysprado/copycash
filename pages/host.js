import {useState, useEffect} from 'react'
import {BUY_URL, PAIR_URL} from '../constants'

function send(event,paridade, expiracao, tipo, direcao){
    //if (prompt('Autorizar operação: ')==='1234'){
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
        fetch(BUY_URL, reqOptions)
            .then(response => response.json())
            .then(data => console.log(data))
    //}
}

export default function Host(){
    const [ativos, setAtivos] = useState([''])
    const [paridade, setParidade] = useState()
    const [expiracao, setExpiracao] = useState(1)
    const [tipo, setTipo] = useState('BINÁRIA')
    const [direcao, setDirecao] = useState('BAIXO')

    useEffect(()=>{
        async function loadData(){
            const response = await fetch(PAIR_URL)
            const paridades = await response.json()
            setAtivos(paridades)
        }
        loadData()
    }, [])

    return(
        <div id='host'>
            <div className='container'>
                <div>
                    <p>Paridade</p>
                    <select onChange={(event)=>setParidade(event.target.value)}>
                    <option disabled selected value>-- BINÁRIA --</option>
                        {   
                            ativos.binary &&
                            ativos.binary.map((ativo) => {
                                return(
                                    <option>{ativo}</option>
                                )
                            })
                        }
                        <option disabled>-- DIGITAL --</option>
                        {
                            ativos.digital &&
                            ativos.digital.map((ativo)=>(<option>{ativo}</option>))
                        }
                    </select>
                </div>
                <div>
                    <p>Direção</p>
                    <select onChange={(event)=>setDirecao(event.target.value)}>
                        <option>BAIXO</option>
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
                        <option>BINÁRIA</option>
                        <option>DIGITAL</option>
                    </select>
                </div>
                
                <button onClick={(event)=>send(event, paridade, expiracao, tipo, direcao)}>ENVIAR</button>
                
            </div>
            
        </div>
    )
}