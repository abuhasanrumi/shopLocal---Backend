const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const productModel = require("../models/productModel")

// Creating product
const createProduct = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// get a single product
const getAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await productModel.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// get all products
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const getAllProducts = await Product.find()
        res.json(getAllProducts)
    } catch (error) {
        throw new Error(error)
    }
})
module.exports = { createProduct, getAProduct, getAllProduct }

