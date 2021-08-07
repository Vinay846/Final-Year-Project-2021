import styled from 'styled-components';

const getHeight=()=> {
    let h = window.innerHeight;
    let calHeight = `${(h*2.5).toString()}px`
    if(h < 820 && window.innerWidth < 900){
        return `${(h-200).toString()}px`;
    }
    return calHeight;
}

const getWidth=()=> {
    let w = window.innerWidth;
    let calWidth = `${(w*1.2).toString()}px`
    if(w < 420){
        return `${(w).toString()}px`;
    }
    return calWidth;
}


const TopSection = styled.section`
    
    text-align: center;
    h1 {
        font-size: xxx-large;
    }
    h2 {
        font-size: xx-large;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: xx-large;
        }
        h2 {
            font-size: x-large;
        }
    }

`;

const BottomSection = styled.section`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 4rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const FormControl = styled.div`
    margin-top: 0.5rem;
    button {
        background-color: #C6F7C2;
        font: inherit;
        border: 1px solid #2dc653;
        border-radius: 5px;
        padding: 0.25rem 1rem;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.26);
        color: black;
        cursor: pointer;
        margin-right: 2rem;
        margin-top: 1rem;
        transition: all 0.2s ease-in-out;
        &:hover {
            background: #2dc653;
        }
    }

    input {
        display: block;
        width: 300px;
        height: 40px;
        padding: 0 8px;
        border-radius: 10px;
        border: 1px solid black;
        font-size: medium;
        outline: none;
    }

    
`;


const Table = styled.table`
    width: 60%;

    @media(max-width: 768px){
        width: 100%;
    }
`;

const Th = styled.th`
    text-align: left;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    border-left: 1px solid #000;
`;

const Td = styled.td`
    text-align: left;
    border-bottom: 1px solid #000;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 70vh;

    @media(max-width: 768px){
        margin-top: 7rem;
    }
`;

const Background = styled.div`
    position: fixed;
    width: ${getWidth()};
    height: ${getHeight()};
    top: ${window.innerWidth < 420 ? '-30%': '-204%'};
    left: ${window.innerWidth < 420 ? '0%': '-10%'};;
    border-radius: 50%;
    background: #C6F7C2;
    z-index: -10;
`;

const Main = styled.main`
    margin: 5rem 4rem;
`;

const ToastColors = {
    success: 'rgba(72, 213, 107, 0.6)',
    failure: 'rgba(239, 239, 31, 0.7)',
}

export {TopSection, BottomSection, Table, Form, FormControl, Th, Td, Main, Background, ToastColors};
