
const queryFetchApi= async (token, type, endPoint, ...res)=> {
    let requestBody = {
        query: `
            ${type} {
                ${endPoint} {
                    ${res[0] === undefined ? '': res[0]}
                    ${res[1] === undefined ? '': res[1]}
                    ${res[2] === undefined ? '': res[2]}
                    ${res[3] === undefined ? '': res[3]}
                    ${res[4] === undefined ? '': res[4]}
                    ${res[5] === undefined ? '': res[5]}
                }
            }
        `
    }
    
    return fetch('https://smart-dustbin-backend.herokuapp.com/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            return resData;
        })
        .catch(err => {
            return err;
        })
}


const graphqFetchApi= async (token, requestBody)=> {
    return fetch('https://smart-dustbin-backend.herokuapp.com/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => {
            // if (res.status !== 200 && res.status !== 201) {
            //     throw new Error('Failed!');
            // }
            return res.json();
        })
        .then(resData => {
            return resData;
        })
        .catch(err => {
            return err;
        })
}

export {queryFetchApi, graphqFetchApi};