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
        type: String,
        required: true
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
        required: false
    },
    projectAccess: { //projetName:projectAccessLevel;projetName:projectAccessLevel;... or all:projectAccessLevel or none
        type: String,
        required: false,
        default: "none"
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', UserScheme);
module.exports = User;