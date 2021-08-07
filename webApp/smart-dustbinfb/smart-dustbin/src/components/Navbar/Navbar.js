import React,{useState, useContext} from 'react'
import styled from 'styled-components'
import {NavLink, useHistory} from 'react-router-dom';
import {Key, LogOut} from 'react-feather'
import AuthContext from '../../context/auth-context';
import Toast from '../Toast/Toast';
import {Menu, X} from 'react-feather';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const context = useContext(AuthContext);
    const history = useHistory();

    const handleLogout=()=> {
        if(context.token){
            context.logout();
            history.push('/home')
        }
    }

    return (
        <>
        <Nav>
            <Logo href="/"><span>SmartDustbin</span></Logo>

            <Hamburger onClick={() => setIsOpen(!isOpen)}>
            {isOpen ?<X size={35}/>:<Menu size={35}/>}
            </Hamburger>

            <MenuList isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <MenuLink><NavLink to="/home">Home</NavLink></MenuLink  >
                <MenuLink><NavLink to="/Explore">Explore</NavLink></MenuLink  >
                <MenuLink><NavLink to="/dustbins">Locations</NavLink></MenuLink  >
                {context.token &&
                <>
                <MenuLink><NavLink to="/Points">Points</NavLink></MenuLink  >
                <MenuLink><NavLink to="/Profile">Profile</NavLink></MenuLink  >
                </>
                }
                <LastChildMenuLink onClick={handleLogout}><NavLink to="/login">{context.token ? <LogOut /> : <Key />}</NavLink></LastChildMenuLink>
            </MenuList>
        </Nav>
        {context.toast.show && <Toast showToast={context.toast}/>}
        </>
    )
}

export default Navbar

const Nav = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    background: linear-gradient(to top, #c6f7c2, #b5f9b2, #a3fba2, #8efd92, #75ff81);
    @media (max-width: 768px) {
        padding-top: 1rem;
    }
`;

const Logo = styled.a`
    margin-left: 1rem;
    color: black;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    span {
        margin-left: 0.5rem;
    }
    
`;

const Hamburger = styled.div`
    display: none;
    cursor: pointer;
    margin-right: 1rem;
    
    @media (max-width: 768px) {
        display: flex;
    }

`;

const MenuList = styled.ul`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    @media (max-width: 768px) {
        overflow: hidden;
        flex-direction: column;
        width: 81%;
        max-height: ${({isOpen}) => isOpen ? "300px": "0"};
        transition: max-height 0.3s ease-in;
    }

`;

const MenuLink = styled.li`
    list-style: none;
    padding: 0.4rem 1.5rem;
    cursor: pointer;
    text-align: center;
    color: white;
    transition: all 0.2s ease-in;
    font-size: 0.9rem;
    max-width: max-content;
    border-radius: 15px;

    a {
        text-decoration: none;
        color: black;
        &.active {
            border-radius: 15px;
            padding: 0.4rem 1rem;
            background: #C6F7C2;
        }
    }
    &:hover {
        background: #C6F7C2;
    }

    
`;

const LastChildMenuLink = styled(MenuLink)`

    a {
        &.active {
            padding: 1rem 1rem;
        }
    }
`;
