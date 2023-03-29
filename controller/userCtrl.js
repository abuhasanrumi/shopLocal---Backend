const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")

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

// update a user
const updateAnUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, {
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
    try {
        const deleteAnSingleUser = await User.findByIdAndDelete(id)
        res.json({
            deleteAnSingleUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createUser, loginUserCtrl, getallUser, getaSingleUser, deleteAnSingleUser, updateAnUser }