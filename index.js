const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const dotenv = require('dotenv').config()
const dbConnect = require("./config/dbConnect")
const authRouter = require("./routes/authRoute")

const PORT = process.env.PORT || 4000;


dbConnect()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api/user", authRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})