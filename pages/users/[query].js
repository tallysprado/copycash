import Navbar from '../../components/Navbar'
import Head from '../../components/Head'
import Card from '../../components/Card'
import { useState, useEffect } from "react"

const titles = [
    "Histórico",
    "Configurações",
]

const Dashboard = () => {
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
        
    }, [])

    return(
        <div id='dashboard'>
            <Head/>
            <Card title='Conta' history/>
            <Card title='Configurações' config/>
        </div>
    )
}
export default Dashboard