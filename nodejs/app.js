// Importing required things
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

// Importing Router
const router = require("./router/routes")

const app = express()

dotenv.config({path:"./config.env"})
const port = process.env.PORT || port

// Using router
app.use(cors())
app.use(router)
app.use(express.json())

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})
