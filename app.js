const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');//3rd pary pkg to set cookies
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())//get POST data & pass it to req
app.use(cookieParser())//can now be used anywhere in app.js

// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
const dbURI = 'mongodb://localhost:27017/node_auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(8000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser); //all GET requests have access to checkUser middlewre
app.get('/', (req, res) => res.render('home'));
//using the requireAuth middleware on a route
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

//COOKIES
//setting 'em...as we are the server to send to Browser
//can be viewed in chrom dev or using console(document.cookie)
//custom properties using cookieparser in an obj{} arg eg
//maxAge - cookie time b4 expiry/(default is session ie expires if browser closed)
//secure - cookie set only in https websites
//httpOnly - cant view cookie in JS/console ie (document.cookie) 
app.get('/set-cookie', (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true') //normally
  res.cookie('newUser', false)//using cookieParser
  //options-optional//check more fields in chromdev cookie-table
  res.cookie('isEmployee', true, {maxAge: 1000 * 60, secure: true, httpOnly: false})
  res.send('you got the cookie')
});

//getting 'em can get on any url though
app.get('/read-cookie', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies)//js obj
  console.log(cookies.newUser)//js obj
  res.json(cookies)//turn to JSON to send to DOM 
  res.send('Cookie', cookies)
});

app.use(authRoutes);