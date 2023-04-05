const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const express = require('express')
const app = express();
const dotenv = require('dotenv').config()
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const morgan = require("morgan")

const PORT = process.env.PORT || 4000;


dbConnect()
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/user", authRouter)
app.use("/api/product", productRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})