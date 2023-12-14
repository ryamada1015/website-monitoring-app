'use strict';
const cors = require('cors');
const express = require("express");
const cookieParser = require("cookie-parser");

require('dotenv').config();

const port = process.env.NODE_PORT || 80;

const app = express();

app.use(cors({
    origin: '*' ,
    credentials: true,
    strict: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/tracker/', require('./src/routes/TrackRouter.js'));
app.use('/api/user/', require('./src/routes/UserRouter.js'));
app.use('/api/auth/', require('./src/routes/AuthRouter.js'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
