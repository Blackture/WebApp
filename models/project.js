const mongoose = require('mongoose');
const ProjectScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    iconUrl: {
        type: String,
        required: false,
        default: "none"
    },
    progress: { //in percent
        type: String,
        required: true,
        default: "0"
    },
    version: { //in percent
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Project = mongoose.model('Project', ProjectScheme);
module.exports = Project;