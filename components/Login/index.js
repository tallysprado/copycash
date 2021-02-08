import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Link from 'next/link'
import {LOGIN} from '../../constants'
import {useRouter} from 'next/router'
import Cookies from 'universal-cookie'
import {parseCookies} from '../../helpers'
import 'isomorphic-fetch'


const Login = ()=>{
    const [email, setEmail] = useState('')
    const [senha, setPassword] = useState('')
    const router = useRouter()
    const cookies = new Cookies()
    
    const handleSignIn = async (event, router, email, senha) => {
        event.preventDefault()

        let opts = {
            'username': email,
            'password': senha
        }
        fetch(LOGIN,{
            method: 'POST',
            body: JSON.stringify(opts)
        })
        .then(r=> r.json())
        .then(token => {
            console.log(token.username)        
            if (token.access_token){
                trigger = true
                console.log(token)
                if(token.username=='user2'){
                    router.push({
                        pathname:'/host',
                        query: { login:'true' }
                    })
                }                
                else{
                    router.push('/dashboard')
                }
                cookies.set('username', token.username, {path: '/'})

                //dispatch({type: 'LOGIN', title: true })
            }
            else{
                trigger = false
            }
        })
    }
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
                    <input id='txtPass' onChange={(event)=>{
                        setPassword(event.target.value)
                    }} placeholder='Digite aqui...' type='password'/>
                    <button id='btnSubmit' onClick={(event)=>handleSignIn(event,router,email, senha)}>
                        Entrar
                    </button>
                </div>                  
            </div>
        </div>
    )
}


export default Login