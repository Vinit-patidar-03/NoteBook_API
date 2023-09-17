const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const router = express.Router();

//Route 1: Get all the notes using get: "/api/notes/fetchNotes" login required
router.get('/fetchNotes', fetchUser, async (req, res) => {
  //   obj=
  //   {
  //     a:'this',
  //     number:54
  //   }

  // res.json([])
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
})

//Route 2: adding New note Using Post: "/api/notes/addNotes"
router.post('/addNotes', fetchUser, [
  body('title', 'Enter title with minimum 5 letters').isLength({ min: 5 }),
  body('description', 'Enter description of atleast 8 letters').isLength({ min: 8 })], async (req, res) => {

    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;

      const note = new Notes({
        title, description, tag, user: req.user.id
      })
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }

  })

//Route 3: Update an existing Notes login required
router.put('/updateNotes/:id', fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //Create a new Note Object
  try {
    const newNotes = {};
    if (title) {
      newNotes.title = title;
    }
    if (description) {
      newNotes.description = description;
    }
    if (tag) {
      newNotes.tag = tag;
    }

    //finding notes to be updated
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send('Not Found');
    }

    //verifying whether user owns it
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }
    notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNotes }, { new: true });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }

})

//Route 4: deletion of an existing Notes login required
router.delete('/deleteNotes/:id', fetchUser, async (req, res) => {
  try {
    //finding notes to be deleted
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send('Not Found');
    }

    // Verifying user
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }
    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "message": "Notes Deleted Successfully", "Note_Id": req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }

})

module.exports = router