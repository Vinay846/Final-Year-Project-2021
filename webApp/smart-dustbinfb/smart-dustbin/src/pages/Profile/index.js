import React,{useState, useContext, useEffect} from 'react'
import { User } from 'react-feather';
import AuthContext from '../../context/auth-context';
import {TopSection, BottomSection, FormControl, Form, ToastColors} from '../../components/Styles/styles'
import {graphqFetchApi} from '../../components/FetchApi/FetchApi';
import Spinner from '../../components/Spinner/Spinner';

function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mnumber, setMnumber] = useState('');
    const [rfid, setRfid] = useState('');
    const context = useContext(AuthContext);
    const [edit, setEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate= async (e)=> {
        e.preventDefault();
        if(!edit){
            setEdit(true);
        }else{
            let requestBody = {
                query: `
                    mutation updateProfile($name: String!, $email: String!, $mnumber: String!, $rfid: String!) {
                        updateProfile(updateInput: {name: $name, email: $email, mnumber: $mnumber, rfid: $rfid}){
                            name
                            email
                            mnumber
                            rfid
                        }
                    }
                `,
                variables: {
                    name: name,
                    email: email,
                    mnumber: mnumber,
                    rfid: rfid,
                }
            };
            
            try {
                setIsLoading(true);
                const response = await graphqFetchApi(context.token, requestBody);
                context.handleProfile(response.data.updateProfile);
                setEdit(false);
                setIsLoading(false);
                context.showToast( true, 'Profile Updated !', ToastColors.success);
            } catch (error) {
                setEdit(false);
                setIsLoading(false);
                console.log(error);
                context.showToast( true, 'Failed !', ToastColors.failure);
            }
        }

    }

    useEffect(() => {
        if(context.profile === null){
            return;
        }
        setName(context.profile.name);
        setEmail(context.profile.email);
        setMnumber(context.profile.mnumber);
        setRfid(context.profile.rfid);
    }, [context.profile]);

    return (
        <>
        <TopSection>
            <h2>UPDATE YOURSELF</h2>
            <User size={90} strokeWidth={0.5}/>
            <h4>Hello</h4>
            <h3>{name}</h3>
        </TopSection>
        <BottomSection style={{marginTop: '-55px'}}>
            <Form style={{marginTop: '0'}}>
                <FormControl>
                    <label htmlFor="name">Name</label>
                    <input disabled={!edit} value={name} type="text" name="name" id="name" onChange={(e) => setName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <label htmlFor="email">Email</label>
                    <input disabled={!edit} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <label htmlFor="mnumber">Mobile Number</label>
                    <input disabled={!edit} value={mnumber} type="Number" name="mnumber" id="mnumber" onChange={(e) => setMnumber(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <label htmlFor="rfid">RFID</label>
                    <input disabled={!edit} value={rfid} type="text" name="rfid" id="rfid" onChange={(e) => setRfid(e.target.value)}/>
                    {isLoading ? <Spinner />: <button onClick={(e) => handleUpdate(e)}>{edit ? "Update": "Edit"}</button>}
                </FormControl>
            </Form>
        </BottomSection>
        </>
    )
}

export default ProfilePage;
