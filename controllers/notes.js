const Notes = require('../models/notes');
const Helper = require('./helper');
//This function is used to add a new note for each patient based on a patient's ID
const addNote = async(req, res)=>{
    const patId = req.params.patId; 
    let date = new Date();
    let style = Helper.styleSingleNoteOrMessage(req.body.fontFamily, req.body.fontSize, req.body.fontWeight, req.body.fontStyle, req.body.textAlign);
    let newNote = {
        content: req.body.note,
        time: date,
        style: style
    }
    console.log(newNote);
    try{
        let notes = await Notes.findOneAndUpdate({userId: patId}, {$push: {notes:newNote}});

        if(!notes){
            let newN = [];
            newN.push(newNote);
            //create a new note
            notes = new Notes({userId: patId, notes: newN});
            notes.save();
        }
        res.redirect(`/clinician/note/${patId}`);
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg: "Error while adding a new note"});
    }
}

//This function is called by a clinician to see all the notes taken for a current patient
const getNotes = async(patId)=>{
    try{
        let notes = await Notes.findOne({userId: patId});
        console.log(notes.notes);
        return notes.notes;
    }
    catch(err){
        console.log(err);
    }
}

//This function is called by a clinician to delete a note
const deleteNote = async(req, res)=>{
    const patId = req.params.patId;
    try{
        let notesForUser = await Notes.findOne({userId: patId});
        //get all the stored notes
        let storedN = notesForUser.notes;
        //delete the required one
        storedN = storedN.filter(note =>note._id != req.body.noteId);
        //update user's collection of notes
        notesForUser.notes = storedN;
        await notesForUser.save();
        res.status(200).send({msg: "delete successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg: "Error while deleting a note"});
    }
}

module.exports = {
    addNote,
    getNotes,
    deleteNote
}