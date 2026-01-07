const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user_id:String,
    username:String,
    description:String,
    url:String,
    location:String,
    tags:Array,
    created_at: {
        type:Date,
        default: Date.now()
    },
    likes:{
        type: Number,
        default: 0
    },
    comments:{
        type:Number,
        default: 0
    }
})


const post = new mongoose.model("post",schema);
module.exports = post;