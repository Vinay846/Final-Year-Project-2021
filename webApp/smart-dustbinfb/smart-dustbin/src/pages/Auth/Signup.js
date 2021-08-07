import React, {useState, useContext} from 'react';
import {useHistory } from 'react-router-dom';
import {Form, FormControl, ToastColors} from '../../components/Styles/styles';
import { graphqFetchApi } from '../../components/FetchApi/FetchApi';
import Spinner from '../../components/Spinner/Spinner';
import AuthContext from '../../context/auth-context';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mnumber, setMnumber] = useState('');
    const [rfid, setRfid] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(AuthContext);
    

    const submitHandler = async (event) => {
        event.preventDefault();
        if (name.trim().length === 0 ||
        email.trim().length === 0 ||
        mnumber.trim().length === 0 ||
        rfid.trim().length === 0 ||
        password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                mutation CreateUser($name: String!, $email: String!, $mnumber: String!, $rfid: String!, $password: String!) {
                    createUser(userInput: {name: $name, email: $email, mnumber: $mnumber, rfid: $rfid, password: $password}){
                        _id
                        email
                    }
                }
            `,
            variables: {
                name: name,
                email: email,
                mnumber: mnumber,
                rfid: rfid,
                password: password
            }
        };

        try {
            setIsLoading(true);
            const response = await graphqFetchApi('token', requestBody);
            console.log(response);
            if(response.errors){
                setIsLoading(false);
                context.showToast( true, response.errors[0]['message'], ToastColors.failure);
                return;
            }
            if (response.data.createUser._id !== '') {
                console.log("Account created");
                setIsLoading(false);
                context.showToast( true, 'Account created Login now', ToastColors.success);
            }
            history.push('/login');
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            context.showToast( true, 'Try again !', ToastColors.failure);
        }

    }

    return (
        <Form onSubmit={submitHandler}>
            <FormControl>
                <label htmlFor="name">Name</label>
                <input value={name} type="text" name="name" id="name" onChange={e => setName(e.target.value)} />
            </FormControl>
            <FormControl>
                <label htmlFor="email">Email</label>
                <input value={email} type="text" name="email" id="email" onChange={e => setEmail(e.target.value)} />
            </FormControl>
           <FormControl>
                <label htmlFor="password">Password</label>
                <input value={password} type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
            </FormControl>
            <FormControl>
                <label htmlFor="mnumber">Mobile Number</label>
                <input value={mnumber} type="number" name="mnumber" id="mnumber" onChange={e => setMnumber(e.target.value)} />
            </FormControl>
            <FormControl>
                <label htmlFor="rfid">RFID</label>
                <input value={rfid} type="text" name="rfid" id="rfid" onChange={e => setRfid(e.target.value)} />
            </FormControl>
            {isLoading ? <Spinner />: <FormControl>
                <button type="submit">Signup</button>
                <button onClick={() => history.push('/login')} type="button">Switch to Login</button>
            </FormControl>}
        </Form>
    )
}

export default Signup
