const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    res.send('Scraping bot')
});

require('./src/app');

app.listen(port, () => console.log(`running in port: ${port}`));