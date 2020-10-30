const express = require('express');
const router = express.Router();
const User = require("../models/user.js")
const Project = require("../models/project.js")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { render } = require('ejs');

//login handle
router.get('/login', (req, res) => {
    res.render('login', {
        title: "Login"
    });
})
router.get('/register', (req, res) => {
    res.render('register', {
        title: "Register"
    })
})

//Register handle
router.post('/register', (req, res) => {
    const { username, firstname, lastname, address, city, country, email, password, password2 } = req.body;
    var projectsAccess = "";
    Project.find({}, (err, projects) => {
        projects.forEach(function (project) {
            var state = project.state;
            var splState = state.split(':');
            var projName = project.name;
            var _projName = projName.replace(" ", "-");
            var visibility = project.visibility;
            if (splState[1] == "open") {
                projectsAccess += _projName + ":2"
            } else if (visibility == "Public"){
                projectsAccess += _projName + ":1"
            } else {
                projectsAccess += _projName + ":0"
            }
        })
    });
    let errors = [];
    console.log(' Name: ' + username + ' email :' + email + ' pass:' + password);
    if (!country || !username || !firstname || !lastname || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }
    //check if match
    if (password != password2) {
        errors.push({ msg: "passwords dont match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({ msg: 'password atleast 6 characters' })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            username: username,
            firstname: firstname,
            lastname: lastname,
            address: address,
            city: city,
            country: country,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        //validation passed
        User.findOne({ email: email }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: 'email already registered' });
                render(res, errors, username, email, password, password2);

            } else {
                const newUser = new User({
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                    accountType: "normal",
                    address: address,
                    city: city,
                    country: country
                });
                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    console.log(value)
                                    req.flash('success_msg','You have now registered!')
                                    res.redirect('/users/login');
                                })
                                .catch(value => console.log(value));

                        }));
            } //ELSE statement ends here
        }
        );
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
        })(req,res,next);
})

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
})
module.exports = router;