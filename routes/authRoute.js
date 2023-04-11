const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaSingleUser, deleteAnSingleUser, updateAnUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, fotgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUserCtrl)
router.post("/admin-login", loginAdmin)
router.post("/cart", authMiddleware, userCart)
router.post("/cart/apply-coupon", authMiddleware, applyCoupon)
router.post("/cart/cash-order", authMiddleware, createOrder)
router.put("/update-password", authMiddleware, updatePassword)
router.post("/forgot-password-token", fotgotPasswordToken)
router.put("/reset-password/:token", resetPassword)
router.put("/order/update/:id", authMiddleware, isAdmin, updateOrderStatus)
router.get("/all-users", getallUser)
router.get("/get-orders", authMiddleware, getOrders)
router.get("/refresh", handleRefreshToken)
router.get("/wishlist", authMiddleware, getWishlist)
router.get("/cart", authMiddleware, getUserCart)


router.get("/logout", logout)
router.get("/:id", authMiddleware, isAdmin, getaSingleUser)
router.delete("/empty-cart", authMiddleware, emptyCart)
router.delete("/:id", deleteAnSingleUser)
router.put("/edit-user", authMiddleware, updateAnUser)
router.put("/save-address", authMiddleware, saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

module.exports = router;