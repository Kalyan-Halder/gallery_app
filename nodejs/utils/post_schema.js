const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    user_Id:String,
    user_name:String,
    title:String,
    description:String,
    url:String,
    created_at: {
        type:Date,
        default: Date.now()
    }
})


const post = new mongoose.model("post",schema);
module.exports = post;