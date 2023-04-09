const Category = require("../models/prodCategoryModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongoDbId")

// create a category
const createProdCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// update a category
const updateProdCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// delete a category
const deleteProdCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedCategory = await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// get a category
const getProdCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// get a category
const getAllProdCategory = asyncHandler(async (req, res) => {
    try {
        const getCategory = await Category.find()
        res.json(getCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createProdCategory, updateProdCategory, deleteProdCategory, getProdCategory, getAllProdCategory }