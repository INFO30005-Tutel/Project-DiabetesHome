const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId:{
        type: String, //clinicians need to give notes to each patient -> need to have patient IDs
        required: true
    },
    notes:[
        {
            content:{type:String, required: true},
            time:{type:Date, required: true},
            type: {type: Number, default:1},
            style:{type:String}
        }
    ],
})
module.exports  = mongoose.model('Note', NoteSchema);