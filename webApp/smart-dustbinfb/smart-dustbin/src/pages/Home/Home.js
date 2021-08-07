import React,{useContext} from 'react'
import { UserCheck, Trash2, Gift } from 'react-feather';
import {TopSection, BottomSection} from '../../components/Styles/styles';
import styled from 'styled-components';
import AuthContext from '../../context/auth-context';
import { useHistory } from 'react-router-dom';

const StyledDiv = styled.div`
    cursor: pointer;
    &:hover {
        color: green;
    }

    @media (max-width: 768px) {
        span {
            margin-left: 3.4rem;
        }
    }
`;


function Home() {
    const context = useContext(AuthContext);
    const history = useHistory();

    const handleClickAccount=()=>{
        if(context.token !== null){
            history.push('/profile');
        }else{
            history.push('/login');
        }
    }
    
    const handleClickPoints=()=>{
        if(context.token !== null){
            history.push('/points');
        }else{
            history.push('/login');
        }
    }

    return (
        <>
        <TopSection>
            <h1>Save Environment</h1>
            <h2>By Earning Rewards</h2>
        </TopSection>
        <BottomSection>
            <StyledDiv  onClick={handleClickAccount}>
                <span><UserCheck size={200} strokeWidth={0.2}/></span>
                <p>MAKE ACCOUNTS WITH US</p>
            </StyledDiv>
            <StyledDiv onClick={() => history.push('/dustbins')}>
                <Trash2 size={200} strokeWidth={0.2} fillOpacity="10%"/>
                <p>USE OUR SMARTDUSTBIN</p>
            </StyledDiv>
            <StyledDiv onClick={handleClickPoints}>
                <Gift size={200} strokeWidth={0.2}/>
                <p>EARN POINTS</p>
            </StyledDiv>
        </BottomSection>
        </>
    )
}

export default Home;