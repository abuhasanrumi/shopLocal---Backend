const Coupon = require("../models/couponModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongoDbId")

// create a coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// get a coupon
const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getCoupons = await Coupon.find()
        res.json(getCoupons)
    } catch (error) {
        throw new Error(error)
    }
})

// update a coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// delete a coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id)
        res.json(deletedCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// get a coupon
const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getCoupon = await Coupon.findById(id)
        res.json(getCoupon)
    } catch (error) {
        throw new Error(error)
    }
})



module.exports = { createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupon }

