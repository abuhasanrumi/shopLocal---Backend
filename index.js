const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const express = require('express')
const app = express();
const dotenv = require('dotenv').config()
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const prodCategoryRouter = require("./routes/prodCategoryRoute");
const blogCategoryRouter = require("./routes/blogCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");

const morgan = require("morgan")
const cors = require('cors')

const PORT = process.env.PORT || 4000;


dbConnect()
app.use(morgan("dev"))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use("/api/blog", blogRouter)
app.use("/api/product-category", prodCategoryRouter)
app.use("/api/blog-category", blogCategoryRouter)
app.use("/api/brand", brandRouter)
app.use("/api/coupon", couponRouter)
app.use("/api/color", colorRouter)
app.use("/api/enquiry", enqRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})