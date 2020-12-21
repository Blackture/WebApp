const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth.js");

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('Docs/docs', {
        user: req.user,
        title: "Docs"
    });
})

router.get('/administrative_page/project', ensureAuthenticated, (req, res) => {
    res.render('Docs/Administrative Page/Project', {
        user: req.user,
        title: "Docs"
    });
})

router.get('/administrative_page/project/name', ensureAuthenticated, (req, res) => {
    res.render('Docs/Administrative Page/Project/name', {
        user: req.user,
        title: "Docs"
    });
})




router.get('/administrative_page/user', ensureAuthenticated, (req, res) => {
    res.render('Docs/Administrative Page/User', {
        user: req.user,
        title: "Docs"
    });
})


module.exports = router;