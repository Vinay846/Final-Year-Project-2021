import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import {Form, FormControl, ToastColors} from '../../components/Styles/styles';
import { graphqFetchApi } from '../../components/FetchApi/FetchApi';
import Spinner from '../../components/Spinner/Spinner';
import styled from 'styled-components';
import LoginWithGoogle from './LoginWithGoogle';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const context = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [reset, setReset] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        if(email.trim().length === 0 || password.trim().length === 0){
            if(!reset || email.trim().length === 0){
                return;
            }
        }
        let requestBody;

        if(reset){
            requestBody = {
                query: `
                    query forgotPassword($email: String!) {
                        forgotPassword(email: $email) {
                            message
                        }
                    }
                `,
                variables: {
                    email: email,
                }
            }
        }else{
            requestBody = {
                query: `
                    query Login($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                            userId
                            token
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            }
        }


        try {
            setIsLoading(true);
            const response = await graphqFetchApi('token', requestBody);
            console.log(response);
            setIsLoading(false);
            if(response.errors){
                throw new Error(response.errors[0]['message']);
            }
            if (response.data.login !== undefined) {
                if(response.data.login){
                    context.login(
                        response.data.login.token,
                        response.data.login.userId,
                        )
                        context.showToast( true, 'Logged in', ToastColors.success);
                    }
                    history.push('/');
                }
            else if(response.data.forgotPassword !== undefined){
                context.showToast( true, response.data.forgotPassword.message, ToastColors.success);
            }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                context.showToast( true, error.toString(), ToastColors.failure);
        }
    }

    const handleReset=()=> {
        if(reset){
            setReset(false);
        }else{
            setReset(true);
        }
    }
    

    return (
        <>
        <Form onSubmit={submitHandler}>
            <FormControl>
                <label htmlFor="email">Email</label>
                <input value={email} type="text" name="email" id="email" onChange={e => setEmail(e.target.value)} />
            </FormControl>
            {!reset && <FormControl>
                <label htmlFor="password">Password</label>
                <input value={password} type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
            </FormControl>}
            <FormControl>
            {isLoading ? <Spinner />: 
                <>
                    <button type="submit">{reset ? 'Reset' : 'Login'}</button>
                    <button onClick={() => history.push('./signup')} type="button">Switch to Signup</button>
                </>
            }
            </FormControl>
            <FormControl>
                <Reset>
                    <input type="checkbox" id="reset" name="reset" value={reset} onChange={handleReset}/>
                    <label htmlFor="reset">Forgot Password ?</label>
                </Reset>
            </FormControl>
            <FormControl>
                <LoginWithGoogle />
            </FormControl>
        </Form>
        </>
    )
}

export default Login

const Reset = styled.div`
    display: flex;
    margin-top: 1rem;
    input {
        height: 20px;
        width: 20px;
        cursor: pointer;
    }
    label {
        margin-left: 1rem;
    }

`;

