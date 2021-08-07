import React from 'react'
import styled from 'styled-components';
import {Trash} from 'react-feather';

function BinList({trashData}) {
    if(trashData === undefined){
        return(
            <>
            </>
        );
    }
    let {lat, lng} = JSON.parse(trashData.location);
    return (
        <>
           <TrashBody>
                <TrashAndtext>
                    <TrashStatus>
                        <Trash size={150} strokeWidth={0.3} color={getColor(trashData.status)} fill={getColor(trashData.status)} fillOpacity={0.4}/>
                        <p style={{fontWeight: 'bold'}}>{trashData.status}%</p>
                    </TrashStatus>
                   <TrashAddress>
                       <h3>{trashData.address}</h3>
                       <p>Established: {getDateAndTime(trashData.createdAt)}</p>
                       <p>Last sync: {getDateAndTime(trashData.updatedAt)}</p>
                   </TrashAddress>
                </TrashAndtext>
                <MapSection>
                    <iframe title={trashData.Id} src={`https://www.google.com/maps/embed/v1/place?key=${'AIzaSyDE94h_oXfBAi5iWqLrMAAVQKWCeZPWjNs'}%20&q=${lat},${lng}`} style={{border: '1px solid black'}} loading="lazy" width="100%" height='100%' allowFullScreen></iframe>
                </MapSection>
            </TrashBody> 
        </>
    )
}

export default BinList

const TrashBody = styled.section`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.5rem;
`;

const TrashAndtext = styled.div``;

const TrashStatus = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
        position: absolute;
        top: 42%;
        left: 48%;
    }

    @media(max-width: 768px){
        p {
            position: absolute;
            top: 39%;
            left: 46%;
        }
    }
`;

const TrashAddress = styled.div`
    h3 {
        margin: 0 auto;
    }
    p {
        margin: 0 auto;

    }

    @media(max-width: 768px){
        p {
            margin: 0.5em auto;
        }
    }
`;

const MapSection = styled.div`
    align-self: center;
`;



const getDateAndTime=(createdAt)=> {
    let date = new Date(createdAt).toDateString('en-US');
    let time = formatAMPM(createdAt);
    return date+" "+time;
}

function formatAMPM(createdAt) {
    let date = new Date(createdAt);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const getColor=(status)=>{
    if(status < 33){
        return 'green';
    }
    else if(status > 33 && status < 75){
        return 'yellow'
    }
    else if(status > 75 && status < 100){
        return 'red'
    }
}