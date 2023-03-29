const { Mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = Mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected")
    } catch (err) {
        console.log("Database error")
    }
}

module.exports = dbConnect