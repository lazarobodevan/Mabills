const express = require('express');
const app = express();
const cors = require('cors')
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');

var bodyParser = require('body-parser');

app.use(cors());

//use bodyParser() to let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRouter);
app.use(transactionRouter);
app.use(express.json());

module.exports = app;