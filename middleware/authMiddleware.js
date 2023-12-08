//middle to protect routes from unauthed users
const jwt = require('jsonwebtoken')

//middleware takes 3 args -request, response & next()
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

module.exports = { requireAuth };