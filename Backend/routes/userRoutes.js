const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const { createUser, loginUser, getUser } = require("../Controller/User");
const router = express.Router();

router.post("/user/create", createUser);
router.post("/user/login", loginUser);
router.get("/user/get", verifyAuth, getUser);
// router.get("/user/get",verifyAuth, getUsers); // this is working fine

module.exports = router;
