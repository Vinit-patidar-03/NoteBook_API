const connectToMongo= require('./db');
const express = require('express')
const cors = require('cors');
require('dotenv').config({path: './.env'});

//Initializing Express app
const app = express()
//CORS ensures that we are sending the right headers.
app.use(cors());

const bodyParser = require("body-parser"); 
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

//Connecting to MongoDB
connectToMongo();

//Initializing Apis
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

//The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. 
app.use(express.json()); 

// app.get('/auth/signup', (req, res) => {
//     res.send('Hello signup')
//   })

//   app.get('/auth/signin', (req, res) => {
//     res.send('Hello signin')
//   })

//available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})