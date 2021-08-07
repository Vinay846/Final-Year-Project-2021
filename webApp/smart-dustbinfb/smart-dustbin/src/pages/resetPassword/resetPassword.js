import React,{useState, useContext} from 'react'
import AuthContext from '../../context/auth-context';
import {graphqFetchApi} from '../../components/FetchApi/FetchApi';
import Spinner from '../../components/Spinner/Spinner';
import {Form, FormControl, ToastColors} from '../../components/Styles/styles';
import {useHistory, useParams} from "react-router-dom";


function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(AuthContext);
    let { resetToken } = useParams();
    const history = useHistory();

    const submitHandler = async (event) => {
        event.preventDefault();
        if(newPassword.trim().length === 0 || confirmPassword.trim().length === 0){
            context.showToast( true, 'Fill all field', ToastColors.failure);
            return;
        }
        if(newPassword !== confirmPassword){
            context.showToast( true, 'Password not match', ToastColors.failure);
            return;
        }

        let requestBody = {
            query: `
                mutation verifyToken($token: String!, $newPassword: String!) {
                    verifyToken(resetPassInput: {token: $token, newPassword: $newPassword}) {
                        message
                    }
                }
            `,
            variables: {
                token: resetToken,
                newPassword: newPassword,
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
            if(response.data.verifyToken !== undefined){
                context.showToast( true, response.data.verifyToken.message, ToastColors.success);
                history.push('/login');
            }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                context.showToast( true, error.toString(), ToastColors.failure);
        }
    }

    return (
        <>
        <Form onSubmit={submitHandler}>
            <FormControl>
                <label htmlFor="newPassword">New Password</label>
                <input value={newPassword} type="password" name="newPassword" id="newPassword" onChange={e => setNewPassword(e.target.value)} />
            </FormControl>
            <FormControl>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input value={confirmPassword} type="password" name="confirmPassword" id="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} />
            </FormControl>
            <FormControl>
                {isLoading ? <Spinner />: <button type="submit">Change</button>}
            </FormControl>
        </Form>
        </>
    )
}

export default ResetPassword
