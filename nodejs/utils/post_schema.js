const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user_id:String,
    username:String,
    title:String,
    description:String,
    url:String,
    location:String,
    tags:String,
    created_at: {
        type:Date,
        default: Date.now()
    }
})


const post = new mongoose.model("post",schema);
module.exports = post;