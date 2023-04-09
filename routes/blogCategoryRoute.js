const express = require('express')
const { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategory } = require('../controller/BlogCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createBlogCategory)
router.put("/:id", authMiddleware, isAdmin, updateBlogCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteBlogCategory)
router.get("/:id", authMiddleware, isAdmin, getBlogCategory)
router.get("/", authMiddleware, isAdmin, getAllBlogCategory)

module.exports = router