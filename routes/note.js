const express = require('express').Router();
const router = express;
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/Userfetch');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
//ROUTER-1 FETCH ALL NOTES
router.get('/fetchallnotes', fetchuser, async (req, res) => {
   const notes = await Notes.find({ user: req.user.id })
   res.json(notes);
})

//ROUTER-2 ADD-NOTES
router.post('/addnote', fetchuser, [
   body('tag', 'Enter valid tag length').isLength({ min: 3 }),
   body('description', 'Enter valid Description length').isLength({ min: 5 }),
], async (req, res) => {
   try {


      const note = new Notes({
         tag: req.body.tag,
         title: req.body.title,
         description: req.body.description,
         user: req.user.id
      })
      const savednote = await note.save();
     // console.log(savednote)
      res.json(savednote);
   }
   catch (error) {
      console.error(error.message);
      res.status(400).send("Internal server error");
   }
})
//ROUTER-3 UPDATE NOTES
router.put('/update/:id', fetchuser, async (req, res) => {
   const { tag, title, description } = req.body;
   const newnote = {}
   if (title) { newnote.title = title }
   if (tag) { newnote.tag = tag }
   if (description) { newnote.description = description }
   //find the note and update it
   let note = await Notes.findById(req.params.id)
   if (!note) { res.status(400).send("Not found") }
   if (note.user.toString() !== req.user.id) { res.status(400).send("Not found") }

   note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
   res.json(note)
})


//ROUTER-4 DELETE NOTES
router.delete('/delete/:id', fetchuser, async (req, res) => {
   
   //find the note and DELETE it
   let note = await Notes.findById(req.params.id)
   if (!note) { res.status(400).send("Not found") }
   if (note.user.toString() !== req.user.id) { res.status(400).send("Not found") }
   note = await Notes.findByIdAndDelete(req.params.id, { new: true })
   res.json(note)
})

module.exports = router
