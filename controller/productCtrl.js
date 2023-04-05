const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const productModel = require("../models/productModel")
const slugify = require("slugify")

// Creating product
const createProduct = asyncHandler(async (req, res) => {
    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
    }
    try {
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// update product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updatedProduct = await Product.findOneAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedProduct)

    } catch (error) {
        throw new Error(error)
    }
})

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        res.json(deletedProduct)

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
module.exports = { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct }

