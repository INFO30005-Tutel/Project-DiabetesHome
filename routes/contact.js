const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
const req = require('express/lib/request');
const express = require('express');
const app = express();
require('dotenv').config();

//provide credentials to authorize Nodemailer to use email as sender
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'jerryluong2108@gmail.com',
        pass: '09092188Na'

    }
})
app.post('/contact-us', (req, res) =>{
    console.log(req.data);

})
const mailOption = {
    from: req.body.email,
    to: 'jerryluong2108@gmail.com',
    subject: `Message from ${req.body.email}`
}