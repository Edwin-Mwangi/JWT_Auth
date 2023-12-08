//middle to protect routes from unauthed users
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//middleware func takes 3 args -request, response & next()
const requireAuth = (req, res, next) => {
    //find token from browsers request in cookie..we named it jwt
    const token = req.cookies.jwt;
    //checks if token exists
    if(token) {
        //.verify() in jwt takes 3 args the token, the str used to create sigature & a func
        //secretStr used to try & decode token & compare with server token 
        //func has err or decodedToken based on outcome of token decoding
        jwt.verify(token, 'my secret string', (err, decodedToken) => {
            if(err) {
                res.redirect('/login')
            }else{
                //if token valid
                console.log(decodedToken)
                next();//continue to next part
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

//another middleware func to check if user is logged in
//res.locals enables us to inject server data into views ie res.locals.xys='blah
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'my secret string',async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                //locals varName user'll be null if decodedToken invalid
                res.locals.user = null;
                next();
            }else{
                //if token valid
                //get payload(user id) we used in token creation to find user in db(async)
                const user = await User.findById(decodedToken.id)
                console.log(decodedToken)
                res.locals.user = user;//user now accesible in views
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}


module.exports = { requireAuth, checkUser };