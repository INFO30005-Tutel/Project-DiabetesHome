const Notes = require('../models/notes');

//This function is used to add a new note for each patient based on a patient's ID
const addNote = async(req, res)=>{
    const patId = req.params.patId; 
    let jsonDate = new Date().toJSON();
    let date = new Date(jsonDate);
    let newNote = {
        content: req.body.note,
        time: date
    }
    try{
        let notes = await Notes.findOneAndUpdate({userId: patId}, {$push: {notes:newNote}});
    
        if(!notes){
            let newN = [];
            newN.push(newNote);
            //create a new note
            notes = new Notes({userId: patId, notes: newN});
            notes.save();
        }
        console.log(notes);
        res.redirect(`/clinician/notes/${patId}`);
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg: "Error while adding note"});
    }
}

//This function is called by a clinician to see all the notes taken for a current patient
const getNotes = async(patId)=>{
    try{
        let notes = await Notes.findOne({userId: patId});
        return notes.notes;
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg: "Error while sending notes"});
    }
}

module.exports = {
    addNote,
    getNotes
}