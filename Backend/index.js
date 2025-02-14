const express = require("express")
const cors = require('cors')
require('dotenv').config()
const connect = require("./config/connect")
const port = process.env.PORT || 5001
const app = express()
app.use(express.json())
app.use(cors())

app.route('/').get((req,res)=>{
    res.send("This is MindMate AI Backend Route")
})

connect().then(response=>{
    console.log(response);
    app.get("/",(req,res)=>{
        res.send(response)
    })
}).catch(response=>{
    console.log(response);
    app.get("/",(req,res)=>{
        res.send(response)
    })
})

app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
})