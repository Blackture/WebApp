const mongoose = require('mongoose');
const LicenseScheme = new mongoose.Schema({
    uuid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    used: {
        type: Boolean, // is true if the license has already be assigned to an account
        required: true
    },
    project: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    filters: {
        type: Array,
        required: true,
        default: ['', '']

    }
});
const License = mongoose.model('License', LicenseScheme);
module.exports = License;