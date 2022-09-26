//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
// var encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
var session = require('express-session')


const saltRounds = 10;


const app = express();


app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://amankumartiwari1502:Harsh9575381459@cluster0.2ur35sv.mongodb.net/userDB';
mongoose.connect(mongoDB);





var Schema = mongoose.Schema;

var userSchema = new Schema({

    email: String,
    password: String
});



// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

var userModel = mongoose.model('user', userSchema);





app.get("/", function (req, res) {



    // newuser.save().then(()=> console.log("saved successfully"));

    res.render("home");

});



app.get("/register", function (req, res) {
    res.render("register");
});

app.post('/register', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        const newuser = new userModel({
            email: username,
            password: hash
        });

        newuser.save().then(() => console.log("authentication Done"));

        //    res.send('hello from simple server :) your authentication done')
        res.redirect("/login");
    });



});

app.get("/login", function (req, res) {



    res.render("login");
});

app.post("/login", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

   

    userModel.findOne({ email: username }, function (err, found) {
        if (!err) {
            if (found) {
                bcrypt.compare(password, found.password, function(err, result) {
                    if(result===true){
                        res.render("secrets");
                    }else {
                        res.send("Sorry your password didn't match");
                    }
                    
                });
                
            } else {
                res.send("please regisster first yourself");
            }
        } else {
            console.log(err);
        }
    })

});












app.listen(process.env.PORT || 3000, function () {
    console.log("Server Started at port 3000");
})



