require("dotenv").config();
const Conversation = require("../models/Conversation");
const Messages = require("../models/Message");
const Users = require("../models/Users");

exports.createMessage = async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");
    if (conversationId == "new" && receiverId) {
      const newCoversation = new Conversation({
        members: [senderId, receiverId],
      });
      await newCoversation.save();
      const newMessage = new Messages({
        conversationId: newCoversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).json("Message sent successfully");
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).json("Message sent successfully");
  } catch (error) {
    console.log(error, "Error");
  }
};

exports.getMessage = async (req, res) => {
  try {
    const checkMessage = async (conversationId) => {
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          return {
            user: { id: user?._id, email: user.email, fullName: user.fullName },
            message: message.message,
          };
        })
      );
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    if (conversationId == "new") {
      const checkConversation = await Conversation.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessage(checkConversation[0]._id.toString());
      } else {
        return res.json([]);
      }
    } else {
      checkMessage(conversationId);
    }
  } catch (error) {
    console.log("Error", error);
  }
};
