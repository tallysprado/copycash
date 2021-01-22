import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Link from 'next/link'
import {LOGIN} from '../../constants'

let trigger = false

function entrar (event,dispatch, email, senha) {
    event.preventDefault()
    let opts = {
        'username': email,
        'password': senha
    }
    fetch(LOGIN,{
        method: 'POST',
        body: JSON.stringify(opts)
    }).then(r=> r.json())
        .then(token => {
            
            if (token){
                trigger = true
                dispatch({type: 'LOGIN', title: true })
            }
            else{
                trigger = false
                dispatch({type: 'LOGIN', title: false })
            }
        })
    /*
    axios.post('http://localhost:5001/api/login', {username: email, password: senha}).then(
        (res) =>{
            console.log(res.data.access_token)
            dispatch({type: 'token', title: res.data.access_token})
        }
    )
    */
}
    
export default function Login(){
    const [email, setEmail] = useState('')
    const [senha, setPassword] = useState('')

    const dispatch = useDispatch()
    const isLogged = useSelector(state=>state.isLogged)
    
    console.log(isLogged)
    console.log(trigger)
    return(
        <div id='entrar'>      
            <div className='entrar'>
                <div className='login'>
                    <h2>Não tem a assinatura de nenhum pacote ainda? Aproveita logo a primeira turma de 30 participantes. Pressione o botão abaixo para adquirir o melhor robô de opções binárias do Brasil.</h2>
                    <button>ADQUIRA JÁ!</button>  
                </div>
                <div className='divider'/>
                <div className='login'>
                    <h3>E-MAIL</h3>
                    <input onChange={(event)=>{
                        setEmail(event.target.value)
                    }} placeholder='Digite aqui...' type='text'/>
                    <h3>SENHA</h3>
                    <input onChange={(event)=>{
                        setPassword(event.target.value)
                    }} placeholder='Digite aqui...' type='password'/>
                    <button type="submit" onClick={(event)=>entrar(event,dispatch,email, senha)}>
                        <Link href={trigger?'/dashboard':'/'} passHref>
                            <a>Entrar</a>
                        </Link>
                    </button>
                </div>                  
            </div>
        </div>
    )
}