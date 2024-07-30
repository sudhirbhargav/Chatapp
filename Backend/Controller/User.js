require("dotenv").config();
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const saltRounds = Number(process.env.SALTROUNDS);

exports.createUser = async (req, res) => {
  const { email, password, fullName } = req.body;
  await Users.findOne({
    email,
  })
    .then(async (result) => {
      if (result) {
        res.json({
          msg: "Email already exits",
        });
      } else {
        const objectid = new mongoose.Types.ObjectId();
        bcrypt.hash(password, saltRounds, async function (err, hash) {
          let user = await Users.create({
            _id: objectid,
            password: hash,
            email: email,
            fullName: fullName,
          });
          res.json({
            data: await Users.findOne({ _id: objectid }),
          });
        });
      }
    })
    .catch((err) => console.log("login user", err));
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDetail = await Users.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    }).lean();
    if (!userDetail) {
      return res.json({
        isSuccess: false,
        msg: "User is not valid",
      });
    }
    bcrypt.compare(password, userDetail.password, async (err, result) => {
      if (err) {
        return res.json({
          isSuccess: false,
          msg: "Error comparing passwords",
        });
      }
      if (result) {
        const { password, ...userWithoutPassword } = userDetail;
        jwt.sign(
          { userDetail },
          process.env.JWT_SECRET,
          { expiresIn: process.env.EXPIRES_IN },
          (err, token) => {
            if (err) {
              return res.json({
                isSuccess: false,
                msg: "Error generating token",
              });
            }
            res.json({
              isSuccess: true,
              userDetail: userWithoutPassword,
              token,
            });
          }
        );
      } else {
        res.json({
          isSuccess: false,
          msg: "Password is incorrect",
        });
      }
    });
  } catch (error) {
    console.log("login", error);
    res.json({
      isSuccess: false,
      msg: "An error occurred during login",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("Error", error);
  }
};
