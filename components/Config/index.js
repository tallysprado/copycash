import {SAVE_CONFIGS} from '../../constants'
import {useState, useEffect} from 'react'

function save(event, email, senha, valor, soros){
    event.preventDefault()
    const reqOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            email: email,
            senha: senha,
            valor: valor,
            soros: soros
        })
    }

    fetch(SAVE_CONFIGS, reqOptions)
    .then(response => response.json())
    .then(data => console.log(data))
}

const Index = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [valor, setValor] = useState()
    const [soros, setSoros] = useState()

    useEffect(()=>{
        setValor(10)
        setSoros(0)
    },[])
    
    return(
        <div id='config'>
            <p>Valor</p>
            <input placeholder='R$'/>

            <p>Soros</p>
            <div>
                <input type='number' placeholder='Nível' min={0}/>
                <input className='check' type='checkbox'/>
            </div>

            <p>E-mail</p>
            <input onChange={(event)=>setEmail(event.target.value)}
            type='text' placeholder='E-mail IQ Option'/>
            <p>Senha</p>
            <input onChange={(event)=>setSenha(event.target.value)}
            type='password' placeholder='Senha IQ Option'/>

            <div className='buttons'>
                <button onClick={(event)=>save(event, email, senha, valor, soros)}>Salvar</button>
                <button>Sair</button>
            </div>

        </div>
    )
}
export default Index