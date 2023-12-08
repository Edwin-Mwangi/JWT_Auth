const User = require('../models/User')
const jwt = require('jsonwebtoken')//pkg to create token

//JWT TOKENS
//an encoded long list of char
//we'll send it to browser to store it in a cookie 
//this cookies we'll be sent to server for every request in Browser
//tokens have 3 parts (i)header(ii)payload(iii)signature(check jwt.io)
//to create signature header and payload are encoded then hashed together with a secret Str
//the signature then added at the end of jwt token.
//when cookies with jwt are received by server,
//it takes the encoded header & payload & hashes 'em with secret Str in server,
//if hashed result matches signature in jwt then token is valid & untampered 


//func to create jwt token & store in a cookie
//we'll use id from mongodb as payload below..headers used automatically
const maxAge = 3*24*60*60 //maxAge vals measured in seconds in jwt
const createToken = (id) => {
    //we want token to expire after 3 days
    //jwt.sign takes 3 args: the payload obj,secret str & options Obj
    return jwt.sign({id},'my secret string',{ expiresIn: maxAge})
}


//handling errors...outside the signup_post func(cleaner code)
const handleErrors = (err) => {
    console.log(err.message, err.code)//in terminal
    let errors = { email: "", password: ""}
    //login error handling...from static methos in User model
    if(err.message === 'incorrect email'){
        errors.email = 'This email is unregistered'
    }
    if(err.message === 'incorrect password'){
        errors.password = 'This password is incorrect'
    }
    //signup error handling
    if(err.code === 11000){
        errors.email = 'Email is already registered'
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

//exporting funcs during creation(can also export below)
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    //we'll create jwt token & store in cookie
    //res.cookie takes 3 args, cookie name,cookie value(token) & options obj to set properties
    //maxAge unit stored in milliseconds in a cookie-maxAge defined at top 
    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)//user._id(mongo doc) is gotten from above
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user: user._id})//passed onto frontend...returned by fetch in const result(check signup.ejs) 
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})//passed onto frontend
    }
}


module.exports.login_get = (req, res) => {
    res.render('login');
}

//we'll use custom method from User model
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        //since user returned if login success(check method in model)
       const user = await User.login(email, password)
       //create jwt & store in cookie to send to browser if login a success
       const token = createToken(user._id)
       res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000})
       res.status(201).json({user: user._id})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

//handle logging out
//want to del cookie but no option so
//update/replace current jwt cookie with one that's blank(has no token) & very short lifespan
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1} );//maxAge of 1ms
    res.redirect("/");
} 
