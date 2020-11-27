const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth.js");
const Project = require('../models/project.js');
const { render } = require('ejs');
const botStopViaWebInterface = require('../discord_bot/src/commands/stopViaWebInterface');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const { user } = require('../discord_bot/src/bot.js');

//login page
router.get('/', (req, res) => {
    res.redirect('/users/login');
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
        title: "bot",
        user: req.user,
    });
})

router.get('/bot_stop', ensureAuthenticated, (req, res) => {
    //console.log("got sth")
    var user =  req.user;
    var accountLvl = 0;
    var accountLvl = (user.accountType == 'owner') ? 0 : (user.accountType == 'admin') ? 1 : (user.accountType == 'developer') ? 2 : (user.accountType == 'mod') ? 3 : (user.accountType == 'tester') ? 4 : (user.accountType == 't-sub/yt-member') ? 5 : (user.accountType == 't-follower/yt-sub') ? 6 : (user.accountType == 'five-year-member') ? 7 : (user.accountType == 'one-year-member') ? 8 : (user.accountType == 'normal') ? 9 : 10;
    if (accountLvl <= 1) {
        botStopViaWebInterface();
    }
    res.redirect('/dashboard');
})

router.get('/bot_start', ensureAuthenticated, (req, res) => {
    var exec = require('child_process').exec;
    console.log("got sth")
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
            title: "Dashboard",
            user: req.user,
            projects: projects
        });
    });
})

router.get('/profile_table', ensureAuthenticated, (req, res) => {
    User.find({}, (err, users) => {
        res.render('profile_table', {
            title: "Profile Table",
            user: req.user,
            users: users
        });
    });
})

var idArray = [''], titleArray = [''], AccountTypeArray = [''], pw_change = [''];

router.post('/profile_table', ensureAuthenticated, (req, res) => {
    console.log(JSON.stringify(req.body));
        User.find({}).exec((err, users) => {
            idArray = req.body.id;
            titleArray = req.body.title;
            AccountTypeArray = req.body.AccountType;
            pw_change = req.body.pw_change;   
            for (var i = 0; i < idArray.length; i++){
                if (idArray.includes(users[i].id)) {
                    var data = {
                    };
                    if (pw_change[i] == "" || !pw_change[i]) {
                        data = {
                            title: titleArray[i],
                            accountType: AccountTypeArray[i]
                        }
                    } else {
                        data = {
                            title: titleArray[i],
                            accountType: AccountTypeArray[i],
                            password: ""
                        }
                        bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(pw_change[i], salt,
                            (err, hash) => {
                                if (err) throw err;
                                //save pass to hash
                                data.password = hash;
                            }));
                    }
                    ProfileChange(users[i], data, res).catch(e => console.log(e));
                }
            }
    })
})


async function ProfileChange(user, data, res) {
    await user.updateOne(data, function (err, doc) {
        if (err) console.log(err);
    })
        .then(() => {
            res.redirect('back');
        })
        .catch(value => { console.log(value); res.redirect('/dashboard'); });
}

router.get('/profile', ensureAuthenticated, (req, res) => {
    Project.find({}, (err, projects) => {
        res.render('profile', {
            title: "Profile",
            user: req.user,
            projects: projects
        });
    })
})

router.get('/register_project', ensureAuthenticated, (req, res) => {
    res.render('register_project', {
        title: "Register Project",
        user: req.user
    });
})

router.get('/delUsr', ensureAuthenticated, (req, res, next) => {
    User.find({}, (err, users) => {
        users.forEach(user => {
            if (user._id == req.query.id) {
                user.deleteOne();
                res.redirect('back');
            }
        })
    })
})


router.get('/change_project', ensureAuthenticated, (req, res, next) => {
    Project.find({}, (err, projects) => {
        res.render('change_project', {
            title: "Change Project",
            user: req.user,
            query: req.query,
            projects: projects
        });
    })
})

router.post('/change_project', ensureAuthenticated, (req, res) => {
    const { id, name, visibility, iconUrl, progress, version, state, downloadUrl } = req.body;
    let errors = [];
    if (!name || !progress || !version) {
        errors.push("Pleasy fill in at least the name, progress and version!")
    }
    if (errors.length <= 0) {
        Project.findOne({ _id: id }).exec((err, project) => {
            if (!project) {
                errors.push({ msg: 'Project does not exist' });
                res.redirect('/dashboard');
            } else {
                var newProject = {
                    name: name,
                    visibility: visibility,
                    iconUrl: iconUrl,
                    progress: progress,
                    version: version,
                    state: state,
                    downloadUrl: downloadUrl
                }
                SetProject(project, newProject, res);
            }
        });
    }
})

async function SetProject(project, newProject, res) {
    await project.updateOne(newProject, function (err, doc) {
        if (err) console.log(err);
    })
        .then(() => {
            SyncAccess();
            res.redirect('/dashboard');
        })
        .catch(value => { console.log(value); res.redirect('/dashboard'); });
}

router.get('/sync_access', ensureAuthenticated, (req, res) => {
    SyncAccess();
    res.redirect('/dashboard');
})

function SyncAccess() {
    User.find({}, (err, users) => {
        users.forEach(function (user) {
            var projectsAccess = "";
            Project.find({}, (err, projects) => {
                projects.forEach(function (project) {
                    var state = project.state;
                    var splState = state.split(':');
                    var projName = project.name;
                    var _projName = projName.replace(" ", "-");
                    var visibility = project.visibility;
                    var accountLvl = 0;
                    var accountLvl = (user.accountType == 'owner') ? 0 : (user.accountType == 'admin') ? 1 : (user.accountType == 'developer') ? 2 : (user.accountType == 'mod') ? 3 : (user.accountType == 'tester') ? 4 : (user.accountType == 't-sub/yt-member') ? 5 : (user.accountType == 't-follower/yt-sub') ? 6 : (user.accountType == 'five-year-member') ? 7 : (user.accountType == 'one-year-member') ? 8 : (user.accountType == 'normal') ? 9 : 10;
                    if (accountLvl <= 4) {
                        projectsAccess += _projName + ":3"
                    } else {
                        if (splState[1] == "open") {
                            projectsAccess += _projName + ":2"
                        } else if (visibility == "Public") {
                            projectsAccess += _projName + ":1"
                        } else {
                            projectsAccess += _projName + ":0"
                        }
                    }
                    user.updateOne({ projectAccess: projectsAccess })
                        .catch(e => console.log(e))
                })
            })
        })
    });
}

router.post('/register_project', (req, res) => {
    const { name, visibility, iconUrl, progress, version, state, downloadUrl } = req.body;
    let errors = [];
    if (!name || !progress || !version) {
        errors.push("Pleasy fill in at least the name, progress and version!")
    }
    if (errors.length <= 0) {
        Project.findOne({ name: name }).exec((err, project) => {
            if (project) {
                errors.push({ msg: 'Project already exists' });
                res.render('register_project', {
                    title: "Register Project",
                    errors: errors,
                    name: name,
                    visibility: visibility,
                    iconUrl: iconUrl,
                    progress: progress,
                    version: version,
                    state: version,
                    downloadUrl: downloadUrl
                })
            } else {
                const newProject = new Project({
                    name: name,
                    visibility: visibility,
                    iconUrl: iconUrl,
                    progress: progress,
                    version: version,
                    state: state,
                    downloadUrl: downloadUrl
                });
                newProject.save()
                    .then(() => {
                        SyncAccess();
                        res.redirect('/dashboard');
                    })
                    .catch(value => console.log(value));
            }
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

module.exports = { router, SyncAccess }; 
