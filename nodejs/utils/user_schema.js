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
    authentication:{
        type:Boolean,
        default:false
    },
    otp:Number,
    address:String,
    bio:String,
    followers:{
        type:Number,
        default:0,
    },
    following:{
        type:Number,
        default:0
    },
    posts:{
        type:Number,
        default:0
    },
    weblink:{
        type:String,
        default:""
    },
    avatarUrl:String,
    coverUrl: String,
    savedPost: Array,
    likedPost: Array
});

schema.pre('save', async function() {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, saltRounds);
        this.conpassword = await bcrypt.hash(this.conpassword, saltRounds);
    }
}); 

const user = new mongoose.model("user",schema);

module.exports = user;