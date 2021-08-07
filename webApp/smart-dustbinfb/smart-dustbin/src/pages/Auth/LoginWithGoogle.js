import React,{useContext} from 'react'
import GoogleLogin from 'react-google-login';
import {useHistory } from 'react-router-dom';
import {graphqFetchApi} from '../../components/FetchApi/FetchApi';
import AuthContext from '../../context/auth-context';
import {ToastColors} from '../../components/Styles/styles';

function LoginWithGoogle() {
    const history = useHistory();
    const context = useContext(AuthContext)
    const responseGoogle= async (response)=> {
        const tokenId = response.tokenId;
        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                    }
                }
            `,
            variables: {
                email: "GoogleAuth",
                password: tokenId
            }
        }

        try {
            const response = await graphqFetchApi('token', requestBody);
            console.log(response);
            if(response.errors){
                throw new Error(response.errors[0]['message']);
            }
            if(response.data.login){
                context.login(
                    response.data.login.token,
                    response.data.login.userId,
                    )
                    context.showToast( true, 'Logged in', ToastColors.success);
                }
                history.push('/profile');
            } 
            catch (error) {
                console.log(error);
                context.showToast( true, "allow cookies", ToastColors.failure);
            }
    }

    return (
        <GoogleLogin
            clientId="973169526764-igvtv3i7h7qt3ki2le94ivo30k0cegq5.apps.googleusercontent.com"
            buttonText="Login with google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    )
}

export default LoginWithGoogle
