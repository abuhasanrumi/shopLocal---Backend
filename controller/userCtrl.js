const User = require("../models/userModel")
const Product = require("../models/productModel")
const Cart = require("../models/cartModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")
const validateMongoDbId = require("../utils/validateMongoDbId")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken")
const sendEmail = require("./emailCtrl")
const crypto = require("crypto")

// register a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const findUser = await User.findOne({ email: email })
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        // user already available
        throw new Error('User Already Exists')
    }
})

// login a user 
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // checking if the user already exists
    const findUser = await User.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(
            findUser.id, {
            refreshToken: refreshToken,
        },
            { new: true }
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid username or password")
    }
})

// admin login 
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // checking if the user already exists
    const findAdmin = await User.findOne({ email })
    if (findAdmin.role !== "admin") throw new Error("Not Authorized")
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id, {
            refreshToken: refreshToken,
        },
            { new: true }
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            token: generateToken(findAdmin?._id)
        })
    } else {
        throw new Error("Invalid username or password")
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in cookies")
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        throw new Error("No refresh token found in DB or not matched")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateRefreshToken(user?._id)
        res.json({ accessToken })
    })
})

// log out handler 
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in cookies")
    }
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) // forbidden 
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204) // forbidden 

})


// update a user
const updateAnUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
        }, {
            new: true
        }
        )
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

// save user address 
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id, {
            address: req?.body?.address,
        }, {
            new: true
        }
        )
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

// get all users 
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

// get a single user 
const getaSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const getaSingleUser = await User.findById(id)
        res.json({
            getaSingleUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// delete a single user 
const deleteAnSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const deleteAnSingleUser = await User.findByIdAndDelete(id)
        res.json({
            deleteAnSingleUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// block user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const block = User.findByIdAndUpdate(
            id, {
            isBlocked: true
        }, {
            new: true
        }
        )
        res.json({
            message: "User Blocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})

//unblock user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const unblock = User.findByIdAndUpdate(
            id, {
            isBlocked: false
        }, {
            new: true
        }
        )
        res.json({
            message: "User Unblocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})

// update password
const updatePassword = asyncHandler(async (req, res) => {
    const id = req.user._id.toHexString()
    const { password } = req.body // Extract password value from req.body
    validateMongoDbId(id)
    const user = await User.findById(id)
    if (password) {
        user.password = password
        const updatedUser = await user.save()
        res.json(updatedUser)
    } else {
        res.json(user)
    }
})

// forgot password token
const fotgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("User not found wiht this email")
    }
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 30 minutes from now. <a href="http://localhost:3000/api/user/reset-password/${token}">Click Here</a>`
        const data = {
            to: email,
            subject: "Forgot Password Link - ShopLocal",
            text: "Hey User",
            htm: resetURL
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})

// reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) {
        throw new Error("Token expired, please try again")
    }
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json(user)
})

// get wishlist of user
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    try {
        const findUser = await User.findById(_id).populate("wishlist")
        res.json(findUser)
    } catch (error) {
        throw new Error(error)
    }
})

// user cart functionality 
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        let products = []
        const user = await User.findById(_id)

        // check if the user already have product in cart
        const alreadyExistsCart = await Cart.findOne({ orderby: user._id })
        if (alreadyExistsCart) {
            alreadyExistsCart.remove()
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.color = cart[i].color
            let getPrice = await Product.findById(cart[i]._id).exec()
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }
        let newCart = await new Cart({
            products, cartTotal, orderby: user?._id
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }
})

// get user cart
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product")
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

// empty cart
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const user = await User.findOne({ _id })
        const cart = await Cart.findOneAndRemove({ orderby: user._id })
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createUser, loginUserCtrl, getallUser, getaSingleUser, deleteAnSingleUser, updateAnUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, fotgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart }