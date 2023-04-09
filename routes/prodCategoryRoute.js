const express = require('express')
const { createProdCategory, updateProdCategory, deleteProdCategory, getProdCategory, getAllProdCategory } = require('../controller/prodCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createProdCategory)
router.put("/:id", authMiddleware, isAdmin, updateProdCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteProdCategory)
router.get("/:id", authMiddleware, isAdmin, getProdCategory)
router.get("/", authMiddleware, isAdmin, getAllProdCategory)

module.exports = router