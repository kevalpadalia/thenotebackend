const express = require("express");
const router = express.Router()
const securityController = require("../controllers/securityController")

const {
    createNewProject,
    getAllProjectsByMe,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectDetails,
    joinProject,
    leaveProject
} = require("../controllers/ProjectController");

// Create New User
router.post('/create/project',[securityController.authenticate],createNewProject)
router.get('/get/all/projects/me',[securityController.authenticate],getAllProjectsByMe)
router.get('/get/all/projects',[securityController.authenticate],getAllProjects)
router.post('/update/project',[securityController.authenticate],updateProject)
router.post('/delete/project',[securityController.authenticate],deleteProject)
router.post('/get/project/details',[securityController.authenticate],getProjectDetails)
router.post('/join/project',[securityController.authenticate],joinProject)
router.post('/leave/project',[securityController.authenticate],leaveProject)

module.exports = router