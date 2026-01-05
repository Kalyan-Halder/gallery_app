const express = require("express")
const router = express.Router()


router.route("/update").post(async(req,res)=>{
     try{
        res.status(200).send("This is the Update")
     }catch(err){
        res.status(400).send("Page not found")
     }
})

module.exports  = router;

