const mongoose = require('mongoose');
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    //custom error handling..using arrays
    //if 1st array element negated, output 2nd element
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,   //unique not custom handled(check controller)
        lowecase: true,
        //to validate email, array has func(can take regex to check) and Str if invalid
        // validate: [()=> {}, 'Email is not valid']
        validate: [isEmail, 'Email is not valid']//alternatively can use validator pkg
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User;