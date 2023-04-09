const express = require('express')
const { createCoupon, updateCoupon, deleteCoupon, getCoupon, getAllCoupon } = require('../controller/couponCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const router = express.Router()

router.post("/", authMiddleware, isAdmin, createCoupon)
router.get("/", authMiddleware, isAdmin, getAllCoupon)
router.put("/:id", authMiddleware, isAdmin, updateCoupon)
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon)
router.get("/:id", authMiddleware, getCoupon)

module.exports = router