import Table from '../Table'
import Config from '../Config'

const Index = ({title, history, config}) => {
    return (
        <div id='card'>
            <div className='title'>
                <h1>{title}</h1>
                <div className='divider'/>
            </div>
            {
                history &&
                <Table/>
            }
            {
                config &&
                <Config/>
            }
        </div>
    )
}
export default Index;