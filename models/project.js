const mongoose = require('mongoose');
const ProjectScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    iconUrl: {
        type: String,
        required: false,
        default: "https://drive.google.com/u/1/uc?id=1pXXu6HLh8TnUFGveGZyWNH-QWMXKfO0W&export=download"
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
    state: {
        type: String,
        required: true,
        default: "NoReleases"
    },
    downloadUrl: {
        type: String,
        required: false
    },
    visibility: {
        type: String,
        required: true,
        default: "Public" //the other one is Private
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Project = mongoose.model('Project', ProjectScheme);
module.exports = Project;