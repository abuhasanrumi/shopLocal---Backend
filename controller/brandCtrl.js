const Brand = require("../models/brandModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongoDbId")

// create a brand
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// update a brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// delete a brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id)
        res.json(deletedBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// get a brand
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// get a brand
const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getBrand = await Brand.find()
        res.json(getBrand)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand }