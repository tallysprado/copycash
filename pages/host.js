import {useState, useEffect} from 'react'

export default function Host(){
    const [ativos, setAtivos] = useState([''])
    const [paridade, setParidade] = useState()
    const [expiracao, setExpiracao] = useState()
    const [tipo, setTipo] = useState()
    const [direcao, setDirecao] = useState()

    return(
        <div id='host'>
            <p>Paridade</p>
            <input type='select'/>
        </div>
    )
}