import Navbar from '../../components/Navbar'
import Head from '../../components/Head'
import Card from '../../components/Card'
import { useState, useEffect } from "react"
import Cookies from 'universal-cookie'
import withAuth from '../../helpers/WithAuth'
import {withRouter} from 'next/router'

const titles = [
    "Histórico",
    "Configurações",
]
const isLoggedIn = false
export async function getStaticProps(){
    const cookies = new Cookies()
    let opts = {
        username: cookies.get('username')
    }
    const token = await fetch('http://localhost:5000/api/protected',{
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+cookies.get('token')
        }
    })
    const tokenData = await token.json()
    const res = await fetch('http://localhost:5000/get_config', {
        method: 'POST',
        body: JSON.stringify(opts)
    })
    const json = await res.json()
    return{
        props: {
            json,
            isLoggedIn,
            tokenData
        }
    }
}

const Dashboard = ({tokenData}) => {
    const [title, setTitle] = useState("Histórico")
    useEffect(() =>{
        if(typeof window !== `undefined`){
            window.onscroll = function() {
                const currentScrollPos = window.pageYOffset;
                const h = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
                const index = parseInt((currentScrollPos + 0.1 * h)/(h));
                setTitle(titles[index]);
            }
        }
        console.log(tokenData)

    }, [])

    return(
        <div id='dashboard'>
            {

            }
            <Head/>
            <Card title='Conta' history/>
            <Card title='Configurações' config/>
        </div>
    )
}

export default Dashboard