const express = require("express");
const router = express.Router()
const securityController = require("../controllers/securityController")

const {
    createNewUser,
    login,
    logout,
    getAllUsers,
    getUserDetails,
    getAllLoggedInUsers
} = require("../controllers/accountController");

// Create New User
router.post('/create/user',createNewUser)
router.post('/login',login)
router.get('/logout',logout)
router.get('/get/all/users',[securityController.authenticate],getAllUsers)
router.get('/get/user/details',[securityController.authenticate],getUserDetails)
router.post('/get/loggedIn/users',[securityController.authenticate],getAllLoggedInUsers)

module.exports = router