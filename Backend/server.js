const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const Users = require("./models/Users");
require("dotenv").config();
require("./db/Connection");
const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];

io.on("connection", (socket) => {

  socket.on("addUser", (userId) => {
    const isUserExisted = users.find((item) => item.userId === userId);

    if (!isUserExisted) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, coversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await Users.findById(senderId);
      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            coversationId,
            receiverId,
            user: {
              id: user?._id,
              fullName: user?.fullName,
              email: user?.email,
            },
          });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to backend");
});

fs.readdirSync("./routes").map((file) => {
  app.use("/api", require("./routes/" + file));
});

app.listen(port, () => {
  console.log("listening on port" + port);
});
