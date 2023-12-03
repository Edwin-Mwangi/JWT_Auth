//exporting funcs during creation(can also export below)

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signup_post = (req, res) => {
    res.send('We will signup later');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = (req, res) => {
    res.send('we will login later');
}
