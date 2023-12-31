const User = require('../models/User')

//exporting funcs during creation(can also export below)
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

//since we have asynchronous code(User.create), whole func has to be async
//User.create(creates local instance of model then saves to db) takes time(async),so add await keyword
//this prevents varName 'user' from being filled with Promise as we wait for it to resolve
//Passwords NEVER stored plainly in db..we'll learn hashing later
module.exports.signup_post = async (req, res) => {
    //destructuring
    const { email, password } = req.body;
    //console.log(email, password)
    try {
        //User.create creates local instance b4 saving
        const user = await User.create({ email, password })
        res.status(201).json(user)//once resolved converted to json
    } catch (err) {
        console.log(err)
        res.status(400).send(`Oops Error - ${err.message}`)
    }

    //res.send('We will signup later');//displayed in POSTMAN
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    res.send('we will login later');
}
