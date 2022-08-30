'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const AboutSchema = new mongoose.Schema({
    name: { type: String, required: false },
    designation: { type: String, required: false },
    description: { type: String,required: false, default: "" },
    atitle: { type: String, required: false },
    adescription: { type: String, required: false },
    otitle: { type: String, required: false },
    odescription: { type: String, required: false },
    obtn_name: { type: String, required: false },
    obtn_link: { type: String, required: false },
    vtitle: { type: String, required: false },
    atitle: { type: String, required: false },
    adescription: { type: String, required: false },
    btitle: { type: String, required: false },
    bdescription: { type: String, required: false },   
    mtitle: { type: String, required: false },
    gtitle: { type: String, required: false },
    gdescription: { type: String, required: false },

    file: { type: objectId, ref: 'File' },
    blog: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('about', AboutSchema);