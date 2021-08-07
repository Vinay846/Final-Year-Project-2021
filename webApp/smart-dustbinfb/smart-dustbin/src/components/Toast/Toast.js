import React from 'react'
import styled from 'styled-components';

function Toast({showToast}) {
    const {color, message} = showToast;

    return <Msg color={color}>{message}</Msg>;
}

export default Toast;


const Msg = styled.h1`
    position: fixed;
    width: max-content;
    top: 2rem;
    background: ${(props) => props.color};
    padding: 0.3rem;
    border-radius: 6px;
    margin: 0;
    font-size: medium;
    font-weight: 800;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
`;
