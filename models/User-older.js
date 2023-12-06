const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    //custom error handling..using arrays
    //if 1st array element negated, output 2nd element
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,   //unique not custom handled(check controller)
        lowecase: true,
        //to validate email, array has func(can take regex to check) and Str if test failed
        // validate: [()=> {}, 'Email is not valid']
        validate: [isEmail, 'Email is not valid']//alternative to func is validator pkg methods
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
})

//MONGOOSE HOOKS
//these are special funcs triggered by mongoose events(eg save) 
//arr func not used to allow usage of 'this'
//'this' obtains local instance of model b4saving to db
//all custom middleware use next() to prevent blocking
/*
userSchema.pre('save', function(next) {
    console.log('user to be created and saved', this);
    next();//to prevent loading after firing
}) 
*/

//using bcrypt(3rs party pkg) to encrypt passwords
//encryption is of 2 processes
//(i) adding salt(extra text b4 hashing making it harder to decrypt) ie test123 -> haBz6test123 
//(ii) hashing(making it jumbled)
//using 'this.password' to take password from local instance obj b4 saving and hash it
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(); //generate salt to add to password(async)
    this.password = await bcrypt.hash(this.password, salt) //add salt & hash(async)
    next();//to prevent loading after firing
})

//post to mean after saving
//we now have doc in db so func takes 2 args
userSchema.post('save', function(doc ,next) {
    console.log('user created and saved', doc);
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;