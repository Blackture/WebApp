const mongoose = require('mongoose');
const UserScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,   //owner, admin, developer, mod, tester, t-sub/yt-member, t-follower/yt-sub, five-year-member, one-year-member, normal
        required: true  // 0       1       2        3     4            5               6                   7                 8           9
    },
    title: {
        type: String,
        required: false,
        default: ""
    },
    titles: {
        type: String,
        required: false,
        default: "" //seperated by a simicolon
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    profileIMG: {
        type: String,
        required: true,
        default: "https://drive.google.com/u/1/uc?id=1pXXu6HLh8TnUFGveGZyWNH-QWMXKfO0W&export=download"
    },
    projectAccess: { //projetName(noWhiteSpaces(-)):(int)projectAccessLevel;projetName:projectAccessLevel;... or all:projectAccessLevel or none //0 is none; 1 is show; 2 is download
        type: String,
        required: true,
        default: "none"
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', UserScheme);
module.exports = User;