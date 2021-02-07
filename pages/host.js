import {useState, useEffect} from 'react'
import {BUY_URL, PAIR_URL} from '../constants'
import NextCors from 'nextjs-cors'

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

const Host= () =>{
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

Host.getInitialProps = async () =>{
    
    const response = await fetch(
        'https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&cliend_id=351b4237-4e99-4069-887f-7d0dd2701556&client_secret=0e457382-961c-4e74-acb9-de10d9432ea5',
        {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Basic MzUxYjQyMzctNGU5OS00MDY5LTg4N2YtN2QwZGQyNzAxNTU2OjBlNDU3MzgyLTk2MWMtNGU3NC1hY2I5LWRlMTBkOTQzMmVhNQ=='
            }
        }
        
    )
    const hotmart = await response.json()
    console.log(hotmart)
    console.log('funcao')
    return {
        props: {
            hotmart
        }
    }
}

export default Host