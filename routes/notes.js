const express = require("express");
const router = express.Router()
const securityController = require("../controllers/securityController")

const {
    createNewNote,
    getAllNotes,
    updateNoteContent,
    updateNotePosition,
    deleteNote,
    getNoteDetails
} = require("../controllers/notesController");

router.post('/create/note',[securityController.authenticate],createNewNote)
router.post('/get/all/notes',[securityController.authenticate],getAllNotes)
router.post('/update/note/content',[securityController.authenticate],updateNoteContent)
router.post('/update/note/position',[securityController.authenticate],updateNotePosition)
router.post('/delete/note',[securityController.authenticate],deleteNote)
router.post('/get/note/details',[securityController.authenticate],getNoteDetails)

module.exports = router