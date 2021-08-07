import React from 'react';
import styled from 'styled-components';
import {CheckCircle, XCircle} from 'react-feather';

function Modal({redeemPoint, closeModal}) {
    const handlecloseModal=()=> {
        closeModal();
    }
    return (
        <OuterBody>
            <InnerBody>
                <Dismiss onClick={handlecloseModal}>
                    <XCircle size={30} strokeWidth={2} color="red"/>
                </Dismiss>
                <MessageBody>
                    <CheckCircle size={150} strokeWidth={0.5} color="green"/>
                    <h1>Congrats you have redeemed {redeemPoint}.00 points</h1>
                    <h1>Successfully</h1>
                </MessageBody>
            </InnerBody>
        </OuterBody>
    )
}

export default Modal;

const OuterBody = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height:100vh;
    display: flex;
    align-items:center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    
`;

const InnerBody = styled.div`
    position: relative;
    height: max-content;
    width: max-content;
    border-radius: 10px;
    border: 2px solid black;
    background-color: rgba(245,255,241, 0.9);
    @media(max-width: 768px) {
        margin: 0 1rem;
    }
`;

const Dismiss = styled.button`
    margin-top: 1.5rem;
    position: relative;
    float: right;
    top: 5%;
    right: 3%;
	border: none;
	padding: 0;
	cursor: pointer;
    transition: all 0.2 ease-in;

    &:hover {
        border-radius: 50%;
        background-color: #c0c3bfe6;
    }
`;

const MessageBody = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
    h1 {
        font-size-adjust: inherit;
        text-align: center;
    }
`;

