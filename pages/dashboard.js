import Navbar from '../components/Navbar'
import Head from '../components/Head'
import Card from '../components/Card'
import { useState, useEffect } from "react"
import Cookies from 'universal-cookie'

const titles = [
    "Histórico",
    "Configurações",
]

export async function getStaticProps(){
    const cookies = new Cookies()
    let opts = {
        username: cookies.get('username')
    }
    const res = await fetch('http://localhost:5000/get_config', {
        method: 'POST',
        body: JSON.stringify(opts)
    })
    const json = await res.json()
    
    return{
        props: {
            json
        }
    }
}

export default function Dashboard (props) {
    const [title, setTitle] = useState("Histórico")
    console.log(props)
    useEffect(() =>{
        if(typeof window !== `undefined`){
            window.onscroll = function() {
                const currentScrollPos = window.pageYOffset;
                const h = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
                const index = parseInt((currentScrollPos + 0.1 * h)/(h));
                setTitle(titles[index]);
            }
        }
        
    }, [])

    return(
        <div id='dashboard'>
            <Head/>
            <Card title='Conta' history/>
            <Card title='Configurações' config/>
        </div>
    )
}
