const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId:{
        type: String, //clinicians need to give notes to each patient -> need to have patient IDs
        required: true
    },
    notes:[
        {
            content:{type:String},
            time:{type:Date, required: true},
            type: {type: Number, default:1}
        }
    ],
})
module.exports  = mongoose.model('Note', NoteSchema);