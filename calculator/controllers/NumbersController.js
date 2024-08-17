const axios = require('axios');

const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
const BASE_URL = 'http://20.244.56.144/test/';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIzODc0NzM5LCJpYXQiOjE3MjM4NzQ0MzksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg3MjNkN2M2LTJkMTctNGRjZi1hYjcxLWU4ZDlmMWRiMzQyNSIsInN1YiI6InNhaXRoYXJha3JlZGR5djU5QGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiODcyM2Q3YzYtMmQxNy00ZGNmLWFiNzEtZThkOWYxZGIzNDI1IiwiY2xpZW50U2VjcmV0IjoiSkVueVVlWFBrY3BFb1BHUSIsIm93bmVyTmFtZSI6IlZlZXJhdmVsbHkgU2FpIFRoYXJhayBSZWRkeSIsIm93bmVyRW1haWwiOiJzYWl0aGFyYWtyZWRkeXY1OUBnbWFpbC5jb20iLCJyb2xsTm8iOiIyMUo0MUEwNVI1In0.MpJV8pYRgBzBhclewM3fROItMfjYlHe2N-pdIuDZeR0';

let numbers = [];


const getUniqueNumber = (num) => {
    return num === null || num === undefined ? null : numbers.includes(num) ? null : num;
};

const calculateAverage = (arr) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return (sum / arr.length).toFixed(2);
};

const fetchNumbers = async (type) => {
    const endpoints = {
        'p': 'primes',
        'f': 'fibo',
        'e': 'even',
        'r': 'rand'
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
        throw new Error('Invalid type provided');
    }

    const url = `${BASE_URL}${endpoint}`;
    try {
        console.log(`Fetching numbers from URL: ${url}`); 
        const response = await axios.get(url, {
            timeout: TIMEOUT_MS,
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`
            }
        });
        console.log(`Received response: ${JSON.stringify(response.data)}`); 
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`); 
        throw new Error('Error fetching data from the server');
    }
};


const getNumbers =  async (req, res) => {
    const type = req.params.type;
    console.log(`Request received for type: ${type}`);
    
    try {
        const newNumbers = await fetchNumbers(type);
        console.log(`New numbers: ${JSON.stringify(newNumbers)}`); 

        const uniqueNumbers = newNumbers
            .map(getUniqueNumber)
            .filter(num => num !== null);

        numbers = [...numbers, ...uniqueNumbers].slice(-WINDOW_SIZE);

        const windowPrevState = numbers.slice(0, numbers.length - uniqueNumbers.length);
        const windowCurrState = numbers;
        const avg = calculateAverage(numbers);

        res.json({
            windowPrevState,
            windowCurrState,
            numbers: uniqueNumbers,
            avg
        });
    } catch (error) {
        console.error(`Internal server error: ${error.message}`); 
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {getNumbers}