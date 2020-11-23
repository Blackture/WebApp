const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth.js");
const Project = require('../models/project.js');
const { render } = require('ejs');
const botStopViaWebInterface = require('../discord_bot/src/commands/stopViaWebInterface');
const User = require('../models/user.js');

//login page
router.get('/', (req, res) => {
    res.redirect('/users/login');
})
//register page
router.get('/register', (req, res) => {
    res.render('register', {
        title: "Register"
    });
})

router.get('/docs', ensureAuthenticated, (req, res) => {
    res.render('Docs/docs', {
        user: req.user,
        title: "Docs"
    });
})

router.get('/bot', ensureAuthenticated, (req, res) => {
    //console.log("got sth")
    res.render('bot', {
        user: req.user,
        title: "bot"
    });
})

router.get('/bot_stop', ensureAuthenticated, (req, res) => {
    //console.log("got sth")
    res.render('bot_stop', {
        user: req.user,
        res : res,
        botStopViaWebInterface: botStopViaWebInterface,
        title: "bot stop"
    });
})

router.get('/bot_start', ensureAuthenticated, (req, res) => {
    var exec = require('child_process').exec;
    console.log("got sth")
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec("node discord_bot", function (error, stdout, stderr) {
        if (!error) {
            console.log(stdout)
        } else {
            console.log(stderr)
        }
    });
    res.redirect('/bot');
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Project.find({}, (err, projects) => {
        res.render('dashboard', {
            user: req.user,
            projects: projects,
            title: "Dashboard"
        });
    });
})

router.get('/profile_table', ensureAuthenticated, (req, res) => {
    User.find({}, (err, users) => {
        res.render('profile_table', {
            user: req.user,
            users: users,
            title: "Profile Table"            
        });
    });
})

router.get('/profile', ensureAuthenticated, (req, res) => {
    Project.find({}, (err, projects) => {
        res.render('profile', {
            user: req.user,
            title: "Profile",
            projects: projects
        });
    })
})

router.get('/register_project', ensureAuthenticated, (req, res) => {
    res.render('register_project', {
        user: req.user,
        title: "Register Project"
    });
})

router.get('/sync_access', ensureAuthenticated, (req, res) => {
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
            User.find({}, (err, users) => {
                users.forEach(function (usr) {
                    usr.projectAccess = projectsAccess;
                })
            })
        })
    });
    res.render('register_project', {
        user: req.user,
        title: "Synchronize Access"
    });
})

router.post('/register_project', (req, res) => {
    const { name, iconUrl, progress, version, state, downloadUrl } = req.body;
    let errors = [];
    if (!name || !progress || !version) {
        errors.push("Pleasy fill in at least the name, progress and version!")
    }
    if (errors.length <= 0) {
        Project.findOne({ name: name }).exec((err, project) => {
            if (project) {
                errors.push({ msg: 'Project already exists' });
                render(res, errors, name, progress, version);
            } else {
                const newProject = new Project({
                    name: name,
                    iconUrl: iconUrl,
                    progress: progress,
                    version: version,
                    state: state,
                    downloadUrl: downloadUrl
                });
                newProject.save()
                    .then(() => {
                        res.redirect('/dashboard');
                    })
                    .catch(value => console.log(value));
            }
        });
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
                User.find({}, (err, users) => {
                    users.forEach(function (usr) {
                        usr.projectAccess = projectsAccess;
                    })
                })
            })
        });
    }
})


router.get('/dashboard_change', ensureAuthenticated, (req, res, next) => {
    Project.find({}, (err, projects) => {
        res.render('dashboard_change', {
            user: req.user,
            title: "Dashboard",
            projects: projects
        });
    })
})

module.exports = router; 