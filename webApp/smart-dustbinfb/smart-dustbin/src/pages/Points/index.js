import React,{useState, useEffect, useContext, useCallback} from 'react'
import AuthContext from '../../context/auth-context';
import { PlusCircle, MinusCircle } from 'react-feather';
import {TopSection, BottomSection, Table, FormControl, Th, Td, ToastColors} from '../../components/Styles/styles';
import {queryFetchApi, graphqFetchApi} from '../../components/FetchApi/FetchApi';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';

function Points() {
    const [points, setPoints] = useState('');
    const context = useContext(AuthContext);
    const [redeemPoint, setRedeemPoint] = useState('');
    const [userTransaction, setUserTransaction] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const closeModal=()=> {
        setShowModal(false);
        setRedeemPoint('');
    }

    const fetchTransation = useCallback(
        async() => {

            try {
                if(context.token === null){
                    return;
                }
                setIsLoading(true);
                const response = await queryFetchApi(context.token, 'query', 'userTransaction', '_id', 'earn', 'redeem', 'createdAt');
                console.log(response);
                setUserTransaction(response.data.userTransaction);
                setPoints(getTotalPoints(response.data.userTransaction));
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        },
        [context.token],
    )

    const handleRedeem=async()=> {
        if(redeemPoint.trim().length === 0){
            return;
        }
        let requestBody = {
            query: `
                mutation removePoint($redeemPoint: Int!) {
                    removePoint(removePointInput: {redeemPoint: $redeemPoint}){
                        _id
                        earn
                        redeem
                        createdAt
                    }
                }
            `,
            variables: {
                redeemPoint:Number(redeemPoint)
            }
        };
        try {
            setIsLoading(true);
            const response = await graphqFetchApi(context.token, requestBody);
            console.log(response);
            if(response.errors){
                throw new Error(response.errors[0]['message'])
            }else{
                let temp = userTransaction;
                temp = [response.data.removePoint, ...temp]
                setUserTransaction(temp);
                setPoints(points - response.data.removePoint.redeem);
            }
            setShowModal(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            context.showToast( true, error.toString(), ToastColors.failure);
        }
    }

    useEffect(() => {
        if(context.profile === null){
            return;
        }
        setPoints(context.profile.sumOfPoints);
    }, [context.profile]);

    useEffect(() => {
        fetchTransation();
    }, [fetchTransation])

    return (
        <>
        <TopSection>
            <h2>YOU ARE DOING</h2>
            <h2>GREAT !</h2>
            <h2>YOU HAVE EARNED {points}.00 POINTS</h2>
        </TopSection>
        <BottomSection>
            <FormControl>
                <label htmlFor="points">Enter Points to redeem</label>
                <input value={redeemPoint} type="Number" name="points" id="points" onChange={(e) => setRedeemPoint(e.target.value)}/>
                {isLoading ? <Spinner />: <button onClick={handleRedeem}>Redeem</button>}
            </FormControl>
        </BottomSection>
        <BottomSection>
        <Table>
            <thead>
                <tr>
                    <Th>Date</Th>
                    <Th>Points</Th>
                    <Th>Transaction</Th>
                </tr>
            </thead>
            {userTransaction.map((transaction) => (
                <tbody key={transaction._id}>
                    <tr>
                        <Td>{getDateAndTime(transaction.createdAt)}</Td>
                        <Td>{`${getTransation(transaction)}`}</Td>
                        <Td>{transaction.earn === null ? <MinusCircle color="red" strokeWidth={1}/>: <PlusCircle color="green" strokeWidth={1}/>}</Td>
                    </tr>
                </tbody>
            ))}
        </Table>
        </BottomSection>
        {showModal && <Modal redeemPoint={redeemPoint} closeModal={closeModal}/>}
        </>
    )
}

export default Points


const getTransation =(transaction)=>{
    if(transaction.earn){
        return transaction.earn;
    }
    return transaction.redeem;
}


const getTotalPoints=(arrOfObj)=>{
    let earn = 0;
    let redeem = 0;
    arrOfObj.forEach((ele) => {
        if(ele.earn !== null){
            earn += ele.earn;
        }else{
            redeem += ele.redeem;
        }
    })
    return earn - redeem;
}

const getDateAndTime=(createdAt)=> {
    let date = new Date(Number(createdAt)).toDateString('en-US');
    let time = formatAMPM(createdAt);
    return date+" "+time;
}

function formatAMPM(createdAt) {
    let date = new Date(Number(createdAt));
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}