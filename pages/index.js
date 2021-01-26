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

const Home = () => {

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
        var input = document.getElementById("txtPass")
        input.addEventListener("keyup", function(event){
            if(event.keyCode===13){
                event.preventDefault()
                document.getElementById('btnSubmit').click()
            }
        })
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

export default Home;