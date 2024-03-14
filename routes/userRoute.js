const express = require("express");
const user_route = express();
const session = require("express-session");
const config = require("../config/config");

user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

const auth = require("../middleware/auth");

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));


/*
//using multer for photo uploading
const multer = require("multer");
//requirinig path module
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,path.join(__dirname,'../public/userImages'));
  },
  filename:function(req,file,cb){
    const name =Date.now()+'-'+file.originalname;
    cb(null,name);
  }
})

//specifying storage to the multer
const upload = multer({storage:storage});
*/

const userController = require("../controllers/userController");

user_route.get("/register", auth.isLogout, userController.loadRegister);
user_route.post("/register", userController.insertUser);

user_route.get("/", auth.isLogout, userController.loadLogin);
user_route.get("/login", auth.isLogout, userController.loadLogin);
user_route.post("/login", userController.verifyLogin);

user_route.get("/home", auth.isLogin, userController.loadHome);

user_route.get("/logout", auth.isLogin, userController.userLogout);

user_route
  .route("/edit")
  .get(userController.editProfile)
  .post(auth.isLogin, userController.updateProfile);

user_route.post("/edit", userController.updateProfile);

module.exports = user_route;
