const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")
const validateMongoDbId = require("../utils/validateMongoDbId")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken")

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

module.exports = { createUser, loginUserCtrl, getallUser, getaSingleUser, deleteAnSingleUser, updateAnUser, blockUser, unblockUser, handleRefreshToken, logout }