const express = require("express");
const adminRoute = express();
const session = require("express-session");
const config = require("../config/config");

adminRoute.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

const bodyParser = require("body-parser");

adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));

adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");

const auth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");

adminRoute.get("/", auth.isLogout, adminController.loadLogin);
adminRoute.post("/", adminController.verifyLogin);
adminRoute.get("/home", auth.isLogin, adminController.loadHome);
adminRoute.get("/logout", auth.isLogin, adminController.logout);
adminRoute.get("/dashboard", auth.isLogin, adminController.admDashboard);
adminRoute.get("/new-user", auth.isLogin, adminController.newUserload);
adminRoute.post("/new-user", auth.isLogin, adminController.addUser);
adminRoute.get("/edit-user", auth.isLogin, adminController.editUserload);
adminRoute.post("/edit-user", auth.isLogin, adminController.updateUser);
adminRoute.get("/delete-user", auth.isLogin, adminController.deleteUser);

adminRoute.get("*", function (req, res) {
  res.redirect("/admin");
});

module.exports = adminRoute;
