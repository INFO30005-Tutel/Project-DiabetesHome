const mongoose = require('mongoose');

const NoteMessageSchema = new mongoose.Schema({
    userId:{
        type: String, //clinicians need to give notes to each patient -> need to have patient IDs
        required: true
    },
    notes:[
        {
            content:{type:String, required: true},
            time:{type:Date, required: true}
        }
    ],
    messages:[
        {
            content:{type:String, required: true},
            time:{type:Date, required: true}
        }
    ]
})
module.exports  = mongoose.model('Notes-Messages', NoteMessageSchema);