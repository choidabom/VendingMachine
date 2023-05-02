const axios = require('axios');
let data = JSON.stringify({
    "vmID": 1,
    "location": "seoul"
});

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/start',
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
};

axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
