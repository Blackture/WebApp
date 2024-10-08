const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 3000;
const favicon = require('serve-favicon');
const path = require('path');
const { ensureAuthenticated } = require('./config/auth');
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
mongoose.connect("mongodb+srv://dbBlaXrewStudios:BlaH4r_32@bxs-admin.qii5u.mongodb.net/bxs-admin?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));
//EJS
app.set('view engine','ejs');
app.set('view cache', false);
app.use(expressEjsLayout);
app.use(favicon(path.join(__dirname, 'assets', 'img', 'favicon.ico')));
//BodyParser
app.use(express.urlencoded({extended : false}));
app.use(express.json());

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
app.use('/',require('./routes/index').router);
app.use('/users',require('./routes/users'));
app.use('/docs',require('./routes/docs'));
app.use(express.static(__dirname + '/assets'));

app.get('*', ensureAuthenticated, function(req, res){
  res.render('404_auth', {
    user: req.user,
    title: 'Error 404'
  })
});

app.post('*', ensureAuthenticated, function(req, res){
  res.render('404_auth', {
    user: req.user,
    title: 'Error 404'
  })
});

app.listen(port, function() {
  console.log("Server started successfully");
}); 