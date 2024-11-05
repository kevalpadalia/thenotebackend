const mongoose = require("mongoose")
const Project = require('../models/projectModel')
const Notes = require('../models/notesModel')

// Create Project
const createNewProject = async (req, res) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.name) {
            let { name, description } = req.body
            let payload = {
                name,
                description,
                createdById: req.token._id,
                createdByName: req.token.name,
                members: [
                    {
                        userId: req.token._id,
                        userName: req.token.name,
                        accessList:["admin","read","write","edit","delete"]
                    }
                ]
            }
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
            try {
                const newProject = await Project.create(payload)
                res.send({
                    status: "success",
                    project: newProject
                })
            } catch (error) {
                res.send({
                    status: "error",
                    message: error.message
                })
            }
        } else {
            res.send(
                {
                    status: "error",
                    message: "Project Name is required!"
                }
            )
        }
    } else {
        res.send(
            {
                status: "error",
                message: "Unauthenticated Access"
            }
        )
    }
}

// Update Project
const updateProject = async (req, res) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id && (req.body.name || req.body.description)) {
            if (!mongoose.Types.ObjectId.isValid(req.body.project_id)) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            let payload = {
                name:req.body.name,
                description:req.body.description
            }
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
            try {
                const updatedProject = await Project.updateOne({_id:req.body.project_id},payload)
                res.send({
                    status: "success",
                    project: updatedProject
                })
            } catch (error) {
                res.send({
                    status: "error",
                    message: error.message
                })
            }
        } else {
            res.send(
                {
                    status: "error",
                    message: "Project Id is required!"
                }
            )
        }
    } else {
        res.send(
            {
                status: "error",
                message: "Unauthenticated Access"
            }
        )
    }
}

// Join Project
const joinProject = async (req, res) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id) {
            const projectId = req.body.project_id;
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.send({
                    status: "error",
                    message: "Invalid Project ID format!"
                });
            }
            try {
                const project = await Project.findById(projectId);
                
                if (project) {
                    // Ensure memebers is defined
                    if (!project.members) {
                        project.members = []; // Initialize to an empty array if undefined
                    }

                    // Check if the user is already a member
                    const isMember = project.members.some(member => member.userId.toString() === req.token._id.toString());
                    if (isMember) {
                        return res.send({
                            status: "error",
                            message: "User is already a member of this project."
                        });
                    }

                    // Add new member
                    project.members.push({
                        userId: req.token._id,
                        userName: req.token.name,
                        accessList: ["admin", "read", "write", "edit", "delete"]
                    });
                    // Save the updated project
                    await project.save();

                    return res.send({
                        status: "success",
                        project
                    });
                } else {
                    return res.send({
                        status: "error",
                        message: "Project not found."
                    });
                }
            } catch (error) {
                console.error(error); // Log the error for debugging
                return res.send({
                    status: "error",
                    message: error.message
                });
            }
        } else {
            return res.send({
                status: "error",
                message: "Project ID is required!"
            });
        }
    } else {
        return res.send({
            status: "error",
            message: "Unauthenticated Access"
        });
    }
};

const leaveProject = async (req, res) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id) {
            const projectId = req.body.project_id;
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.send({
                    status: "error",
                    message: "Invalid Project ID format!"
                });
            }
            try {
                const project = await Project.findById(projectId);
                
                if (project) {
                    // Ensure members is defined
                    if (!project.members) {
                        project.members = []; // Initialize to an empty array if undefined
                    }

                    // Check if the user is already a member
                    const isMember = project.members.some(
                        member => member.userId.toString() === req.token._id.toString()
                    );
                    if (!isMember) {
                        return res.send({
                            status: "error",
                            message: "User does not belong to this project."
                        });
                    }

                    // Remove the user from the members array
                    project.members = project.members.filter(
                        member => member.userId.toString() !== req.token._id.toString()
                    );

                    // Save the updated project
                    await project.save();

                    return res.send({
                        status: "success",
                        project
                    });
                } else {
                    return res.send({
                        status: "error",
                        message: "Project not found."
                    });
                }
            } catch (error) {
                console.error(error); // Log the error for debugging
                return res.send({
                    status: "error",
                    message: error.message
                });
            }
        } else {
            return res.send({
                status: "error",
                message: "Project ID is required!"
            });
        }
    } else {
        return res.send({
            status: "error",
            message: "Unauthenticated Access"
        });
    }
};




// Delete Project
const deleteProject = async (req, res) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id) {
            if (!mongoose.Types.ObjectId.isValid(req.body.project_id)) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            try {
                const updatedProject = await Project.deleteOne({_id:req.body.project_id})
                await Notes.deleteMany({projectId:req.body.project_id})
                res.send({
                    status: "success",
                    project: updatedProject
                })
            } catch (error) {
                res.send({
                    status: "error",
                    message: error.message
                })
            }
        } else {
            res.send(
                {
                    status: "error",
                    message: "Project ID is required!"
                }
            )
        }
    } else {
        res.send(
            {
                status: "error",
                message: "Unauthenticated Access"
            }
        )
    }
}

// Get All Project By Me
const getAllProjectsByMe = async (req, res, next) => {
    if (req.token && req.token.email && req.token._id) {
        let payload = {
            createdById:req.token._id
        }
        const projects = await Project.find(payload)
        if (!projects || projects.length === 0) {
            return res.send(
                {
                    status: "error",
                    message:"No projects found"
                }
            )
        }
        res.send({
            status: "success",
            projects
        })
    } else {
        res.send(
            {
                status: "error",
                message: "Unauthenticated Access"
            }
        )
    }
}

// Get All Project
const getAllProjects = async (req, res, next) => {
    if (req.token && req.token.email && req.token._id) {
        // Construct the query to find projects where the user is either the creator or a member
        const payload = {
            $or: [
                { createdById: req.token._id },
                { "members.userId": req.token._id }
            ]
        };

        try {
            const projects = await Project.find(payload);
            if (!projects || projects.length === 0) {
                return res.send({
                    status: "error",
                    message: "No projects found"
                });
            }
            res.send({
                status: "success",
                projects
            });
        } catch (error) {
             res.send({
                status: "error",
                message: error.message
            });
        }
    } else {
        res.send({
            status: "error",
            message: "Unauthenticated Access"
        });
    }
};


// Get Project Memebers
const getProjectDetails = async (req, res, next) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id && req.body.project_id.id) {
            if (!mongoose.Types.ObjectId.isValid(req.body.project_id.id)) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            const project = await Project.findById(req.body.project_id.id)
            if (!project) {
                return res.send(
                    {
                        status: "error",
                        message:"No projects found"
                    }
                )
            }
            res.send({
                status: "success",
                detail:project
            })
        } else {
            res.send(
                {
                    status: "error",
                    message: "Project ID is required!"
                }
            )
        }
    } else {
        res.send(
            {
                status: "error",
                message: "Unauthenticated Access"
            }
        )
    }
}

module.exports = {
    createNewProject,
    getAllProjectsByMe,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectDetails,
    joinProject,
    leaveProject
}