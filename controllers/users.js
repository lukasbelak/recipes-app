const JWT = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");
require("passport");

const signToken = (user) => {
  return JWT.sign(
    {
      iss: "Reciperaptor",
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    JWT_SECRET
  );
};

module.exports = {
  getById: async (req, res, next) => {
    try {
      // console.log("UserID: " + req.params.id);
      await User.findById(req.params.id).then((user) => res.json(user));
    } catch (err) {
      // console.log("User.getById error: " + err.message);
      res.json({ message: err.message });
    }
  },

  getByUserName: async (req, res, next) => {
    await User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err){
        console.log("User.getByUserName error: " + err.message);
        return res.json({
          isError: true,
          message: err.message,
          user: null,
        });
      }

      if (user) {
        return res.json({
          isError: false,
          message: "Ok",
          user: user,
        });
      } else {
        return res.json({
          isError: true,
          message: "not found",
          user: null,
        });
      }
    });
  },

  signUp: async (req, res, next) => {
    const { userName, password, firstName, lastName } = req.value.body;

    let newUser = new User({
      userName,
      password,
      firstName,
      lastName,
    });
    await newUser.save(function (err, obj) {
      if (err) {
        console.log(err);
        return res.json({
          message: err.errmsg,
          isError: true,
          token: null,
        });
      }

      const token = signToken(newUser);

      return res.json({
        message: "register success",
        isError: false,
        token: token,
      });
    });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async (req, res, next) => {
    res.json({ secret: "resource" });
  },

  logOut: async (req, res, next) => {
    // console.log("in logout");
    req.logOut();
    res.redirect("/");
  },
};
