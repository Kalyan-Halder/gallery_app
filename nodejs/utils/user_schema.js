const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;


const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    email: String,
    phone: String,
    password: String,
    conpassword:String,
    date_of_birth: String,
    created_at:{
        type:Date,
        default: Date.now()
    },
    token:String,
    authetication:{
        type:Boolean,
        default:false
    },
    otp:Number
});

schema.pre('save', async function() {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, saltRounds);
        this.confpassword = await bcrypt.hash(this.conpassword, saltRounds);
    }
}); 

const user = new mongoose.model("user",schema);

module.exports = user;