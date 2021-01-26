import {SAVE_CONFIGS} from '../../constants'
import {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'

function save(event, email, senha, valor, soros, user){
    event.preventDefault()
    const reqOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            email: email,
            senha: senha,
            valor: valor,
            soros: soros,
            username: user,
        })
    }

    fetch(SAVE_CONFIGS, reqOptions)
    .then(response => response.json())
    .then(data => console.log(data))
}

const Index = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [valor, setValor] = useState(2)
    const [soros, setSoros] = useState(0)
    const cookies = new Cookies()
    useEffect(()=>{
        setValor(10)
        setSoros(0)
    },[])
    return(
        <div id='config'>
            <p>Valor</p>
            <input onChange={(event)=>{setValor(event.target.value)}} 
            type='number' min={2} placeholder='R$'/>

            <p>Soros</p>
            <input onChange={(event)=>{setSoros(event.target.value)}} 
            type='number' placeholder='0 para desativado' max={5} min={0}/>

            <p>E-mail</p>
            <input onChange={(event)=>setEmail(event.target.value)}
            type='text' placeholder='E-mail IQ Option'/>
            <p>Senha</p>
            <input onChange={(event)=>setSenha(event.target.value)}
            type='password' placeholder='Senha IQ Option'/>

            <div className='buttons'>
                <button onClick={(event)=>save(event, email, senha, valor, soros, cookies.get('username'))}>Salvar</button>
                <button>Sair</button>
            </div>

        </div>
    )
}
export default Index