const express = require('express');
const connectToDb = require('./config/connectToDb');
require('dotenv').config();

connectToDb();
//Init app
const app = express();

//middleware
app.use(express.json());


//running server
const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} on port ${Port}`);
})