
const Index = () => {

    return(
        <div id='config'>
            <p>Valor</p>
            <input placeholder='R$'/>

            <p>Soros</p>
            <div>
                <input type='number' placeholder='Nível' min={0}/>
                <input className='check' type='checkbox'/>
            </div>

            <div className='buttons'>
                <button>Salvar</button>
                <button>Sair</button>
            </div>

        </div>
    )
}
export default Index