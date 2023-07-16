const router = require("express").Router();
const userCtrller = require("../controllers/user"); //get all exported functions, i.e. exports.signup = ...

router.post("/register", userCtrller.signup);

// Map the `verify` request to the verify function
router.get("/verify/:confirmToken", userCtrller.verifyEmail);

// Map the `login` request to the login function
router.post("/login", userCtrller.login);

module.exports = router;