const Blog = require("../models/blogModel")
const User = require("../models/userModel")
const validateMongoDbId = require("../utils/validateMongoDbId")
const asyncHandler = require('express-async-handler')

// create blog post
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

// update blog post
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBlog)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBlog, updateBlog }