const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaSingleUser, deleteAnSingleUser, updateAnUser } = require("../controller/userCtrl");
const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUserCtrl)
router.put("/:id", updateAnUser)
router.get("/all-users", getallUser)
router.get("/:id", getaSingleUser)
router.delete("/:id", deleteAnSingleUser)

module.exports = router;