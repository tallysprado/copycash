import {useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import Link from 'next/link'

function entrar (event,dispatch, email, senha) {

    event.preventDefault()
    console.log('wtff')
    let opts = {
        'username': email,
        'password': senha
    }
    axios.post('http://localhost:5001/api/login', {username: email, password: senha}).then(
        (res) =>{
            console.log(res.data.access_token)
            dispatch({type: 'token', title: res.data.access_token})
        }
    )
}
    
export default function Login(){
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()
    return(
        <div id='entrar'>      
            <div className='entrar'>
                <h2>Digite o E-mail cadastrado na Hotmart</h2>
                <div className='divider'/>
                <div className='login'>
                    <h3>E-MAIL</h3>
                    <input onChange={(event)=>{
                        setEmail(event.target.value)
                    }} placeholder='Digite aqui...' type='text' />
                    <button type="submit" onClick={(event)=>entrar(event,dispatch,email, 'teste123')} >Entrar</button>
                </div>
            </div>
        </div>
    )
}