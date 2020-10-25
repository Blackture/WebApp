const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require("./config/passport")(passport)
//mongoose
//const MongoClient = require('mongodb').MongoClient;
/*const uri = "mongodb+srv://dbBlackture:SuperMega_32@users.2mrzz.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new mongoose(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

mongoose.connect("mongodb+srv://dbBlackture:BlaH4r321@users.2mrzz.mongodb.net/bxs?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));
//EJS
app.set('view engine','ejs');
app.set('view cache', false);
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));

//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   //use flash
   app.use(flash());
   app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error  = req.flash('error');
   next();
   })

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use(express.static(__dirname + '/assets'));

app.listen(65535); 