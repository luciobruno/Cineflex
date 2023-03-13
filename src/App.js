import { Routes, Route, BrowserRouter } from "react-router-dom"
import styled from "styled-components"
import HomePage from "./pages/HomePage/HomePage"
import SeatsPage from "./pages/SeatsPage/SeatsPage"
import SessionsPage from "./pages/SessionsPage/SessionsPage"
import SuccessPage from "./pages/SuccessPage/SuccessPage"
import { useState } from "react"

export default function App() {

    const [comprado,setComprado] = useState([]);

    return (
        <BrowserRouter>
            <NavContainer>CINEFLEX</NavContainer>
            <Routes>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                <Route path="/sessoes/:idFilme" element={<SessionsPage></SessionsPage>}></Route>
                <Route path="/assentos/:idSessao" element={<SeatsPage comprado={comprado} setComprado={setComprado}></SeatsPage>}></Route>
                <Route path="/sucesso" element={<SuccessPage setComprado={setComprado} comprado={comprado}></SuccessPage>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

const NavContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #C3CFD9;
    color: #E8833A;
    font-family: 'Roboto', sans-serif;
    font-size: 34px;
    position: fixed;
    top: 0;
    a {
        text-decoration: none;
        color: #E8833A;
    }
`
