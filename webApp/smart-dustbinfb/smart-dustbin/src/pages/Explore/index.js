import React,{useState, useEffect} from 'react'
import { queryFetchApi } from '../../components/FetchApi/FetchApi';
import {TopSection, BottomSection, Table, Th, Td} from '../../components/Styles/styles';
import Spinner from '../../components/Spinner/Spinner';

function Explore() {
    const [datas, setDatas] = useState([]);
    const [savior, setSavior] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const response = await queryFetchApi('token', 'query', 'points', '_id', 'name', 'sumOfPoints');
                response.data.points.sort((a, b) => b.sumOfPoints -a.sumOfPoints);
                setDatas(response.data.points);
                setSavior(response.data.points[0].name)
                setIsLoading(false);
                
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        fetchData();
      }, []);

    return (
        <>
        <TopSection>
            <h1>SAVIOR OF THE DAY</h1>
            <h2>{savior}</h2>
            <h2>CONGRATULATIONS !</h2>
        </TopSection>
        {isLoading ? <Spinner />: <BottomSection>
            <Table>
                <thead>
                    <tr>
                        <Th>S.No</Th>
                        <Th>Name</Th>
                        <Th>Points</Th>
                    </tr>
                </thead>
                {datas !== undefined && datas.map((data, index) => (
                    <tbody key={data._id}>
                        <tr>
                            <Td>{index+1}</Td>
                            <Td>{data.name}</Td>
                            <Td>{data.sumOfPoints}.00</Td>
                        </tr>
                    </tbody>
                ))}
            </Table>
        </BottomSection>}
        </>
    )
}

export default Explore
