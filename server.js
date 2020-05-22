const express = require('express');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

require('./src/app');

app.listen(port, () => console.log(`> [server] : running in port: ${port}`));