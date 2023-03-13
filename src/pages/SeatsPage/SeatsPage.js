import styled from "styled-components"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function SeatsPage({ comprador, setComprado }) {

    const { idSessao } = useParams()
    const [items, setItems] = useState([])
    const [seats, setSeats] = useState(undefined)
    const captionCircleColor = ["#1AAE9E", "#C3CFD9", "#FBE192"]
    const captionCircleBorder = ["#0E7D71", "#808F9D", "#F7C52B"]
    const [assentosMarcadosColor, setAssentosMarcadosColor] = useState([]);
    const [assentosMarcadosBorder, setAssentosMarcadosBorder] = useState([]);
    const [name,setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [assentosSelecionados,setAssentosSelecionados] = useState([]);
    const navigate = useNavigate()
    const [assentos,setAssentos] = useState([])

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`

        const promise = axios.get(url)

        promise.then((res) => {
            setItems(res.data)
            setSeats(res.data.seats)
            const listaBorder = [];
            const listaColor = [];
            for (let i = 0; i < res.data.seats.length; i++) {
                listaBorder.push("#808F9D")
                listaColor.push("#C3CFD9")
            }
            setAssentosMarcadosBorder(listaBorder)
            setAssentosMarcadosColor(listaColor)
        })
    }, [])

    function selecionarAssentos(index, seat) {
        if (seat.isAvailable === false) {
            alert("Esse assento não está disponível");
        } else {
            if (assentosMarcadosColor[index] === "#1AAE9E") {
                let listaBorder = [...assentosMarcadosBorder]
                let listaColor = [...assentosMarcadosColor]
                listaBorder[index] = "#808F9D"
                listaColor[index] = "#C3CFD9"
                setAssentosMarcadosBorder(listaBorder)
                setAssentosMarcadosColor(listaColor)
                let listaAssentos = [...assentosSelecionados]
                listaAssentos.splice(listaAssentos.indexOf(seat.id))
                setAssentosSelecionados(listaAssentos)
                let listaDosAssentos = [...assentos]
                listaDosAssentos.splice(listaDosAssentos.indexOf(index+1))
                setAssentos(listaDosAssentos)
            } else {
                let listaBorder = [...assentosMarcadosBorder]
                let listaColor = [...assentosMarcadosColor]
                listaBorder[index] = "#0E7D71"
                listaColor[index] = "#1AAE9E"
                setAssentosMarcadosBorder(listaBorder)
                setAssentosMarcadosColor(listaColor)
                let listaAssentos = [...assentosSelecionados]
                listaAssentos.push(seat.id)
                setAssentosSelecionados(listaAssentos)
                let listaDosAssentos = [...assentos]
                listaDosAssentos.push(index+1)
                setAssentos(listaDosAssentos)
            }
        }
    }

    function enviarPedido(event){
        event.preventDefault()

        const requisicao = axios.post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many",{
            ids: [...assentosSelecionados],
            name: name,
            cpf: cpf
        })

        requisicao.then(()=>{navigate("/sucesso")
            setComprado({
            filme:items.movie.title,
            date:items.day.date,
            hour:items.name,
            ingressos: assentos,
            nome: name,
            cpf: cpf,
        })} )

        requisicao.catch((err) => console.log(err.response))
    }

    if (items.length === 0) {
        return <div>Carregando...</div>
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map((seat, index) => <SeatItem data-test="seat" onClick={() => selecionarAssentos(index, seat)} color={assentosMarcadosColor} border={assentosMarcadosBorder} index={index} seats={seats} key={index}>{index + 1}</SeatItem>)}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle captionCircleBorder={captionCircleBorder[0]} captionCircleColor={captionCircleColor[0]} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle captionCircleBorder={captionCircleBorder[1]} captionCircleColor={captionCircleColor[1]} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle captionCircleBorder={captionCircleBorder[2]} captionCircleColor={captionCircleColor[2]} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                <form onSubmit={enviarPedido}>
                    Nome do Comprador:
                    <input data-test="client-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Digite seu nome..." />

                    CPF do Comprador:
                    <input data-test="client-cpf" type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="Digite seu CPF..." />

                    <button data-test="book-seat-btn" type="submit">Reservar Assento(s)</button>
                </form>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={items.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{items.movie.title}</p>
                    <p>{items.day.weekday} - {items.day.date}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${props => props.captionCircleBorder};       
    background-color: ${props => props.captionCircleColor};    
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid ${props => props.seats[props.index].isAvailable === true ? props.border[props.index] : "#F7C52B"};;         // Essa cor deve mudar
    background-color: ${props => props.seats[props.index].isAvailable === true ? props.color[props.index] : "#FBE192"};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`