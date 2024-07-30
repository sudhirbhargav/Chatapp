const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const { createMessage, getMessage } = require("../Controller/Message");
const router = express.Router();

router.post("/create/message", verifyAuth, createMessage);
router.get("/get/message/:conversationId", verifyAuth, getMessage);
// router.get("/user/get",verifyAuth, getUsers); // this is working fine

module.exports = router;
