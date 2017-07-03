"use strict";
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')

const fs = require('fs');
const https = require('https');

// Connect To Database
mongoose.connect(config.database);

// On Connected
mongoose.connection.on('connected', () => {
    console.log('connected to database' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('database error' + err);
});

const app = express();

const users = require("./routes/users");
//Port number
const port = 3001;

//CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get("/", (req, res, next) => {
    res.send('tututu');
});

app.get("*", (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
    //res.sendFile(path.join(__dirname, 'piblic/index.html'));
});

// Start server
// app.listen(port, () => {
//     console.log('Server started. Port ' + port);
// });

const options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/server.crt')
};
////Start Https-server
https.createServer(options, app).listen(port, () => {
    console.log('Https server started. Port ' + port);
});
