const mongoose = require('mongoose');
const Messages = require('../models/messages');
const Helper = require('./helper');

const sendMessage = async(req, res)=>{
    const patId = req.params.patId; 
    let style = Helper.styleSingleNoteOrMessage(req.body.fontFamily, req.body.fontSize, req.body.fontWeight, req.body.fontStyle, req.body.textAlign);
    let newMessage = {
        content: req.body.message,
        time: new Date(),
        style: style
    }
    try{
        let messages = await Messages.findOne({userId:patId});
        if(!messages){
            let newM = [];
            newM.push(newMessage);
            messages = new Messages({userId: patId}, {$push:{messages:newM}});
            await messages.save();
            res.redirect(`/clinician/message/${patId}`);
            return;
        }
        //get all the stored messages
        let storedM = messages.messages;
        let l = storedM.length;
        //overwrite the latest stored message 
        if(l != 0 && isSameDate(storedM[l- 1].time, newMessage.time)){
            storedM[l-1] = newMessage;
        }
        //it is a new day -> add a new message, no replacement
        else{
            storedM.push(newMessage);
        }
        await messages.save();
        res.redirect(`/clinician/message/${patId}`);
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg: "Error while adding messages"});
    }
}
const isSameDate = (d1, d2)=>{
    if(d1.toDateString() < d2.toDateString()){
        return false;
    }
    return true;
}

const getMessages = async(patId)=>{
    try{
        let messages = await Messages.findOne({userId: patId}).lean();
        return messages !== null ? messages.messages: null;
    }
    catch(err){
        console.log(err);
    }
}

//This function is called by a clinician to delete a message
const deleteMessage = async(req, res)=>{
    const patId = req.params.patId;
    try{
        let messagesForUser = await Messages.findOne({userId: patId});
        //get all the stored messages
        let storedM = messagesForUser.messages;
        //delete the required on
        storedM = storedM.filter(message => message._id != req.body.messageId);
        //update user's collection of messages
        messagesForUser.messages = storedM;
        await messagesForUser.save();
        res.status(200).send({msg: "delete successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({msg: "Error while deleting a message"});
    }
}
module.exports = {
    sendMessage,
    getMessages,
    deleteMessage
}
