const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaSingleUser, deleteAnSingleUser, updateAnUser } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUserCtrl)
router.get("/all-users", getallUser)
router.get("/:id", authMiddleware, isAdmin, getaSingleUser)
router.put("/edit-user", authMiddleware, updateAnUser)
router.delete("/:id", deleteAnSingleUser)

module.exports = router;