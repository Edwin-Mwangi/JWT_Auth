const User = require('../models/User')

//the parent err look like this..simplified
/*{
    errors: {
        email: ValidateError...{
            properties:{...}
            ...
        },
        password: ValidateError...{
            properties:{...}
            ...
        }
    }
}*/

//handling errors...outside the signup_post func(cleaner code)
const handleErrors = (err) => {
    //err.code undefined except when similar email used(unique)(check terminal)
    console.log(err.message, err.code)//in terminal
    let errors = { email: "", password: ""}
    //err.code is 11000(logged to terminal when same email used)
    if(err.code === 11000){
        errors.email = 'Email is already registered'
    }

    //err.message has start of Str that's unchanging:-'user validation failed' 
    //we check if its an err message using that unchanging part
    if(err.message.includes('user validation failed')){
        //parent err obj is HUGE  with nested objs(check above or in terminal)
        //we need properties obj in err.errors(errors a nested obj)
        //turn errors obj to arr(using 'Object.values') to loop each obj to get properties
        //destructuring {properties}..wrap in new set of brackets ()
        // Object.values(err.errors).forEach(error.properties => {
        Object.values(err.errors).forEach(({ properties }) => {
            //another way to update errors obj vals defined above in let
            //if path is email then errors.email is updated with message in that properties Obj
            errors[properties.path] = properties.message;
        })
    }
    return errors;//when func is run this returned
}

//exporting funcs during creation(can also export below)
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password })
        res.status(201).json(user)
    } catch (err) {
        //store func in var so returned values are in the var
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    res.send('we will login later');
}
