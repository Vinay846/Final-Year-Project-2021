import React from 'react';
import styled, {keyframes} from 'styled-components';

function Spinner() {
    return (
        <SpinnerBody>
            <DualRing />
        </SpinnerBody>
    )
}

export default Spinner;

const SpinnerBody = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const rotation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;


const DualRing = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    /* z-index: 15; */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: wait;
    /* background: rgba(0, 0, 0, 0.3); */
    &:after {
        content: " ";
        display: block;
        width: 48px;
        height: 48px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #50f55a;
        border-color: #50f55a transparent #50f55a transparent;
        animation: ${rotation} 1.2s linear infinite;
    }
    
`;

