import ReactPlayer from 'react-player'
import {useState, useEffect} from 'react'


function onClick(view){
    document.getElementById(view).scrollIntoView({ behavior: 'smooth', block: 'center' })
}
export default function Index(){
    
    
    return(
        <div id='landing' className='content'>
            <div style={{display: 'flex', width: '400px',flexDirection: 'column'}}>
                <h1>AS TRÊS VELAS NUNCA ERRAM!</h1>
                <p>Deixe um <i>trader</i> profissional de Opções Binárias operar em sua conta com a técnica de maior assertividade do Brasil.</p>
                <button onClick={()=>onClick('ENTRAR')} className='button'>ENTRAR AGORA</button>
            </div>
            <div className='divider'/>
            <div className='player-wrapper'>
                <ReactPlayer
                className='react-player'
                controls
                width='65vh'
                id='video'
                url='https://www.youtube.com/watch?v=btJ40KLtu24'/>
            </div>
        </div>
    )
}