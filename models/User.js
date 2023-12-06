const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,  
        lowecase: true,
        validate: [isEmail, 'Email is not valid']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
})

//MONGOOSE HOOKS
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(); 
    this.password = await bcrypt.hash(this.password, salt) 
    next();
})

//post to mean after saving
userSchema.post('save', function(doc ,next) {
    console.log('user created and saved', doc);
    next();
})

//CUSTOM STATIC METHOD creation in User model
//'statics' -to add new static method,we name it 'login'
userSchema.statics.login = async function(email, password){
    //'this' now refers to the user model(as instance unavailable)
    //find doc in db where email matches
    const user = await this.findOne({email})
    if(user) {
        //bcrypt hashes incoming pass & compares with db pass
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error('incorrect password')//if pass not similar
    }throw Error('incorrect email')//if user not found

}
const User = mongoose.model('user', userSchema);

module.exports = User;