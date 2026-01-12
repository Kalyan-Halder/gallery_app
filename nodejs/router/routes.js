const express = require("express")
const router = express.Router()


//Calling for database connection
require("../utils/connection");
//very important line or else the json will not work
router.use(express.json())
router.route("/").get((req,res)=>{
    res.status(200).send("This is the Home Page")
})

router.use(require("./registration"))
router.use(require("./signin"))
router.use(require("./update"))
router.use(require("./create_post"))
router.use(require("./verify"))
router.use(require("./reset"))
router.use(require("./profile"))
router.use(require("./all_post"))
router.use(require("./validate_token"))


module.exports  = router;