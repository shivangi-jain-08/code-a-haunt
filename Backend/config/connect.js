const mongoose = require("mongoose")
require("dotenv").config()

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        return "Database Connected"
    } catch (error) {
        return `Unable to connect because of, ${error.message}`
    }
}

module.exports = connect