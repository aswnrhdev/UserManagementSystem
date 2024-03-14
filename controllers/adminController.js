const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
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
        if (userData.is_admin === 0) {
          res.render("login", { message: "Sorry, you're not an admin and do not have access to the admin panel." });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/admin/home");
        }
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
    res.render("home", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

const admDashboard = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    const fullUserdata = await User.find({
      is_admin: 0,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });

    res.render("dashboard", { users: fullUserdata });
  } catch (error) {
    console.log(error.message);
  }
};

const newUserload = async (req, res) => {
  try {
    res.render("new-user");
  } catch (error) {
    console.log(error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    const spassword = await securePassword(password);
    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      password: spassword,
      is_admin: 0,
    });

    const userData = await user.save();

    if (userData) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", { message: "Some thing wrong" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editUserload = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("edit-user", { user: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error updating user.");
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadLogin,
  verifyLogin,
  loadHome,
  logout,
  admDashboard,
  newUserload,
  addUser,
  editUserload,
  updateUser,
  deleteUser,
};
