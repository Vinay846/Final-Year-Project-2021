import React,{useState, useEffect} from 'react';
import {TopSection} from '../../components/Styles/styles';
import BinList from './BinList';
import styled from 'styled-components';

function Bins() {
    const [trashs, setTrashs] = useState([]);
    const [index, setIndex] = useState(0);

    const fetchTrashDetails= async()=> {
        let requestBody = {
            query: `
                query {
                    getDustbinDetails {
                        _id
                        Id
                        address
                        location
                        status
                        createdAt
                        updatedAt
                    }
                }
            `
        }

        fetch('https://smart-dustbin-backend.herokuapp.com/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            setTrashs(resData.data.getDustbinDetails);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        fetchTrashDetails();
    }, [])

    return (
        <>
        <TopSection>
            <h2>You can earn from here...</h2>
            <h3>Total number of installed smart dustbin is {trashs.length}</h3>
        </TopSection>
        <Bottom>
            {trashs===undefined ? '' : <BinList trashData={trashs[index]}/>}
        </Bottom>
        <hr />
        <ListBody>
            <h3>Locations: </h3>
            <ol>
                {trashs!==undefined && trashs.map((trash, idx) => (
                    <List key={trash._id} onClick={()=> setIndex(idx)}>{trash.address}</List>
                ))}
            </ol>
        </ListBody>
        </>
    )
}

export default Bins;

const Bottom = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 5rem;
    @media(max-width: 768px) {
        margin: 0;
    }
`;

const ListBody = styled.div`
    margin-top: 2rem;

`;

const List = styled.li`
    color: black;
    font-weight: 600;
    cursor: pointer;
    &:hover {
        color: green;
    }
`;

