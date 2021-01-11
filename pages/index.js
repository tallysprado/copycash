import { useState, useEffect } from "react"

import Head from '../components/Head'

import Landing from '../components/Landing'
import Navbar from "../components/Navbar"
import Sobre from '../components/Sobre'
import Login from '../components/Login'

const titles = [
    "Copycash",
    "Sobre",
    "Entrar"
]

const Index = () => {

    const [title, setTitle] = useState("Copycash")

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

    return (
    <>
        <Head/>
        <Navbar title={title}/>
        <Landing/>
        <Sobre/>
        <Login/>
        {/* <Projects/> */}
    </>
)
}

export default Index;