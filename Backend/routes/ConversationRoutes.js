const express = require("express");
const { verifyAuth } = require("../middleware/auth");
const {
  createConversation,
  getConversation,
} = require("../Controller/Conversation");
const router = express.Router();

router.post("/conversation", verifyAuth, createConversation);
router.get("/conversation/:userId", verifyAuth, getConversation);
// router.get("/user/get",verifyAuth, getUsers); // this is working fine

module.exports = router;
