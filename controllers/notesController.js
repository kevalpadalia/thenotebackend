const mongoose = require("mongoose")
const Notes = require('../models/notesModel')

// Create Note
const createNewNote = async (req, res) => { 
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id) {
            if (!mongoose.Types.ObjectId.isValid(req.body.project_id)) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            let payload = {
                heading:"New Note",
                description:"Write your thoughts",
                createdById: req.token._id,
                createdByName: req.token.name,
                projectId: req.body.project_id,
                position: JSON.stringify(
                    {
                        x: 200,
                        y:110
                    }
                ),
                colors: JSON.stringify(
                    {
                        colorHeader: "#FFEFBE",
                        colorBody: "#FFF5DF",
                        colorText: "#18181A",
                    }
                )
            }
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
            try {
                const newNote = await Notes.create(payload)
                res.send({
                    status: "success",
                    note: newNote
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
                    message: "Please select valid project"
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
// Update Note Position
const updateNotePosition = async (req, res) => { 
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id && req.body.note_id && req.body.new_position) {
            if (!(mongoose.Types.ObjectId.isValid(req.body.project_id) && mongoose.Types.ObjectId.isValid(req.body.note_id))) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            let payload = {
                position:req.body.new_position
            }
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
            try {
                const updatedNote = await Notes.updateOne({_id:req.body.note_id,projectId:req.body.project_id},payload)
                res.send({
                    status: "success",
                    project: updatedNote
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
// Update Note
const updateNoteContent = async (req, res) => { 
if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id && req.body.note_id && req.body.description) {
            if (!(mongoose.Types.ObjectId.isValid(req.body.project_id) && mongoose.Types.ObjectId.isValid(req.body.note_id))) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            let payload = {
                description:req.body.description
            }
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
            try {
                const updatedNote = await Notes.updateOne({ _id: req.body.note_id, projectId: req.body.project_id }, payload)
                res.send({
                    status: "success",
                    project: updatedNote
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
// Get All Note
const getAllNotes = async (req, res) => {
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id) {
                if (!mongoose.Types.ObjectId.isValid(req.body.project_id)) {
                    return res.send({
                        status: "error",
                        message: "Invalid Project!"
                    })
                }
                let payload = {
                    projectId:req.body.project_id
                }
                const notes = await Notes.find(payload)
                // if (!projects || projects.length === 0) {
                //     return res.send(
                //         {
                //             status: "error",
                //             message:"No Notes are created"
                //         }
                //     )
                // }
                res.send({
                    status: "success",
                    notes
                })
        } else {
            res.send(
                {
                    status: "error",
                    message: "Project ID is required"
                }
            )
        }
    } else {
        console.log(req.token,'in catch')
            res.send(
                {
                    status: "error",
                    message: "Unauthenticated Access"
                }
            )
        }
}
// Get Note Details
const getNoteDetails = async (req, res) => { 

}
// Delete Note
const deleteNote = async (req, res) => { 
    if (req.token && req.token.email && req.token._id) {
        if (req.body.project_id && req.body.note_id) {
            if (!(mongoose.Types.ObjectId.isValid(req.body.project_id) && mongoose.Types.ObjectId.isValid(req.body.note_id))) {
                return res.send({
                    status: "error",
                    message: "Invalid Project!"
                })
            }
            let payload = {
                _id:req.body.note_id,
                projectId:req.body.project_id,
            }
            payload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));
            try {
                const updatedNote = await Notes.deleteOne(payload)
                res.send({
                    status: "success",
                    project: updatedNote
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

module.exports = {
    createNewNote,
    updateNoteContent,
    updateNotePosition,
    getAllNotes,
    getNoteDetails,
    deleteNote
}
