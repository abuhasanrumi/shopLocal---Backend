const Product = require("../models/productModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const productModel = require("../models/productModel")
const slugify = require("slugify")
const { query } = require("express")
const validateMongoDbId = require("../utils/validateMongoDbId")
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary")
const fs = require('fs')


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
    validateMongoDbId(id)
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
    validateMongoDbId(id)

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
    validateMongoDbId(id)

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
        // filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach((element) => delete queryObj[element])

        // filtering for variable values
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))

        // sorting 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ")
            query = query.select(fields)
        } else {
            query = query.select("-__v")
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount) {
                throw new Error("this page does not exists")
            }
        }

        const product = await query
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

// add to wishlist 
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)

    const { prodId } = req.body
    try {
        const user = await User.findById(_id)
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId }
                },
                {
                    new: true
                }
            )
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId }
                },
                {
                    new: true
                }
            )
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})

// rating 
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)

    const { star, comment, prodId } = req.body

    try {
        const product = await Product.findById(prodId)
        let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString())
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            )
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }

        const getAllRatings = await Product.findById(prodId)
        let totalRating = getAllRatings.ratings.length
        let ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)
        let actualRating = Math.round(ratingSum / totalRating)
        let finalProduct = await Product.findByIdAndUpdate(
            prodId, {
            totalRating: actualRating
        },
            { new: true }
        )
        res.json(finalProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// image upload 
const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = async (path) => await cloudinaryUploadImg(path, "images")
        const urls = []
        const files = req.files
        for (let file of files) {
            const { path } = file
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const images = urls.map((file) => {
            return file
        })
        res.json(images)
    } catch (error) {
        throw new Error(error)
    }
})

// image delete from cloudinary 
const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const uploader = cloudinaryDeleteImg(id, "images")
        res.json({ message: "Deleted" })
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages }

