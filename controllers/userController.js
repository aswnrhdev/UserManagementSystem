const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
      is_admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      res.redirect("/login"); 
    } else {
      res.render("registration", { message: "Your registration has failed." });
    }
  } catch (error) {
    
    res.render("registration", { error: error.message });
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login", { message: '' });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user_id = userData._id;
        res.redirect("/home");
      } else {
        res.render("login", { message: "You've entered an incorrect email or password." });
      }
    } else {
      res.render("login", { message: "You've entered an incorrect email or password." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("home", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const editProfile = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await User.findById({ _id: id });
    if (userdata) {
      res.render("edit", { user: userdata });
    } else {
      res.redirect("/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const userdata = await User.findByIdAndUpdate(
      { _id: req.body.user_id },
      { $set: { name: name, email: email, mobile: mobile } }
    );
    res.redirect("/home");
  } catch (error) {
    console.log(error.message);
    res.redirect("/edit");
  }
};


module.exports = {
  loadRegister,
  insertUser,
  loadLogin,
  verifyLogin,
  loadHome,
  userLogout,
  editProfile,
  updateProfile,
};
