const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    userId:{
        type: String, //clinicians need to give notes to each patient -> need to have patient IDs
        required: true
    },
    messages:[
        {
            content:{type:String, required: true},
            time:{type:Date,required:true}
        }
    ]
})
module.exports  = mongoose.model('Message', MessageSchema);