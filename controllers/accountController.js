const crypto = require("crypto");
const mongoose = require("mongoose")
const jwtHelper = require("../helpers/JWTHelper");
const Accounts = require('../models/accountModel')
const Project = require('../models/projectModel')
const config = require('../config.json');

// Create New User
const createNewUser = async (req, res) => {
    if (req.body.email && req.body.name && req.body.password) {
        let password = crypto.createHash('sha256').update(req.body.password).digest('base64')
        let { name, email, phone } = req.body
        let payload = {
            name,
            email,
            phone,
            password,
            loggedIn:true,
            lastLogin:new Date()
        }
        payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
        try {
            const newUser = await Accounts.create(payload)
            let token=jwtHelper.sign(payload,config.signOptions)
            res.send({
                status: "success",
                jwt:token,
                user:newUser
            })
        } catch (error) {
            res.send({
                status: "error",
                message:error.message
            })
        }
    } else {
        res.send(
            {
                status: "error",
                message:"Email, Name & Password is required!"
            }
        )
    }
}

// Login User
const login = async (req, res) => {
    if (req.body.email && req.body.password) {
        let password=crypto.createHash('sha256').update(req.body.password).digest('base64')
        let payload = {
            email: req.body.email,
            password:password
        }
        let user = await Accounts.findOne(payload)
        if (!user) {
            return res.send(
                {
                    status: "error",
                    message:"Wrong Email or Password!"
                }
            )
        }
        await Accounts.updateOne({email:req.body.email},{loggedIn:true})
        payload["_id"]=user._id
        payload["name"]=user.name
        payload["lastLogin"]=user.lastLogin
        payload["loggedIn"]=true
        user["loggedIn"]=true
        let token=jwtHelper.sign(payload,config.signOptions)
        res.send({
            status: "success",
            jwt:token,
            user
        })
    } else {
        res.send(
            {
                status: "error",
                message:"Email & Password is required!"
            }
        )
    }
}

// Logout
const logout = async (req, res, next) => { 
    await Accounts.updateOne({email:req.body.email},{loggedIn:false})
    res.send({
        status:'success',
        authenticated:false
    })
}

// Get All User
const getAllUsers = async (req, res, next) => {
    if (req.token && req.token.email) {
        let payload = {
            email:req.token.email
        }
        const users = await Accounts.find()
        if (!users) {
            return res.send(
                {
                    status: "error",
                    message:"No users found!"
                }
            )
        }
        let token=jwtHelper.sign(payload,config.signOptions)
        res.send({
            status: "success",
            jwt:token,
            users
        })
    } else {
        next()
    }
}

const getAllLoggedInUsers = async (req, res, next) => {
    try {
        if (req.token && req.token.email) {
            console.log(req.body)
            if (req.body.project_id) {
                if (!mongoose.Types.ObjectId.isValid(req.body.project_id)) {
                    return res.send({
                        status: "error",
                        message: "Invalid Project!"
                    });
                }
                const project = await Project.findById(req.body.project_id);

                if (!project) {
                    return res.send({
                        status: "error",
                        message: "Project not found!"
                    });
                }

                // Extract the members array from the project document
                const projectMembers = project.members;

                if (!projectMembers.length) {
                    return res.send({
                        status: "error",
                        message: "No members found in this project!"
                    });
                }

                // Fetch details of all users who are members of the project
                const userIds = projectMembers.map(member => member.userId);
                const users = await Accounts.find({ _id: { $in: userIds } });

                if (!users.length) {
                    return res.send({
                        status: "error",
                        message: "No users found!"
                    });
                }

                res.send({
                    status: "success",
                    users
                });
            } else {
                res.send({
                    status: "error",
                    message: "Project ID is required!"
                });
            }
        } else {
            next();
        }
    } catch (error) {
        console.error("Error fetching logged-in users:", error);
        res.send({
            status: "error",
            message: "An error occurred while processing the request."
        });
    }
};


// Get User Details
const getUserDetails = async (req, res, next) => {
    if (req.token && req.token.email) {
        let payload = {
            email:req.token.email
        }
        const user = await Accounts.findOne(payload)
        if (!user) {
            return res.send(
                {
                    status: "error",
                    message:"User does not exists"
                }
            )
        }
        res.send({
            status: "success",
            user
        })
    } else {
         return res.send(
                {
                    status: "error",
                    message:"User does not exists"
                }
            )
    }
}

module.exports = {
    createNewUser,
    login,
    logout,
    getAllUsers,
    getUserDetails,
    getAllLoggedInUsers 
}