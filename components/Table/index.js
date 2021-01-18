

export default function Table(){
    const dados = [
        {   
            data: "08/11/2020",
            direcao: "BAIXO",
            paridade: "GBPUSD",
            duracao: "60",
            resultado: true,
        },
        {
            data: "08/11/2020",
            direcao: "BAIXO",
            paridade: "GBPCAD",
            duracao: "45",
            resultado: true,
        },
        {
            data: "08/11/2020",
            direcao: "BAIXO",
            paridade: "EURNZD",
            duracao: "120",
            resultado: true,
        },
        {
            data: "08/11/2020",
            direcao: "BAIXO",
            paridade: "GBPUSD",
            duracao: "30",
            resultado: true,
        },
        {
            data: "08/11/2020",
            direcao: "BAIXO",
            paridade: "EURUSD",
            duracao: "15",
            resultado: false,
        },
        {
            data: "08/11/2020",
            direcao: "BAIXO",
            paridade: "EURUSD",
            duracao: "15",
            resultado: true,
        },
    ]
    return(
        <div>
            <table>
                <tr>
                    <th>Data</th>
                    <th>Direção</th>
                    <th>Duração</th>
                    <th>Paridade</th>
                    <th>Resultado</th>

                </tr>

                {
                    dados.map(
                        (operacao) => {
                            const {data, direcao, paridade, duracao, resultado} = operacao
                            return(
                                <tr>
                                    <td style={resultado?{color:'green'}:{color:'red'}} >{data}</td>
                                    <td>{direcao}</td>
                                    <td>{paridade}</td>
                                    <td>{duracao}</td>
                                    <td>{resultado?"WIN":"LOSS"}</td>
                                </tr>
                            )
                        }
                    )
                }
            </table>
        </div>
    )
}