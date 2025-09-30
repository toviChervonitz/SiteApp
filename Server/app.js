const express = require('express');
const http = require('http');
const path = require('path');
const { routerInit } = require('./routes/configRoutes');
require('./db/mongoConnect');


const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../Client')));


routerInit(app);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT);
