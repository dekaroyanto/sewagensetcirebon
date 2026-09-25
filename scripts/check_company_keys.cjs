const http = require('http');

const req = http.request('http://127.0.0.1:8000/api/company', (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log('Company settings from API:\n', JSON.parse(data));
    });
});
req.end();
