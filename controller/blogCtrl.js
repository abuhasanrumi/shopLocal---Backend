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
    validateMongoDbId(id)
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// fetch a blog post
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes')
        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 }
        }, {
            new: true
        })
        res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// fetch all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find()
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

// delete a blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        res.json(deletedBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// like blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // find the login user 
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isLiked = blog?.isLiked
    // find is the user has disliked the blog 
    const alreadyDisliked = blog?.dislikes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    )
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true
        }
        )
        res.json(blog)
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true
        }
        )
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, {
            new: true
        }
        )
        res.json(blog)
    }
})

// dislike blog
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // find the login user 
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isDisliked = blog?.isDisliked
    // find is the user has liked the blog 
    const alreadyLiked = blog?.likes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    )
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true
        }
        )
        res.json(blog)
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true
        }
        )
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        }, {
            new: true
        }
        )
        res.json(blog)
    }
})


module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog }