const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")

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

module.exports = { createUser, loginUserCtrl }