'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const headingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    file: { type: objectId, ref: 'File' },
    description: { type: String,required: false, default: "" },
    otitle: { type: String,required: false, default: "" },
    odescription: { type: String,required: false, default: "" },
    etitle: { type: String,required: false, default: "" },
    edescription: { type: String,required: false, default: "" },
    ctitle: { type: String,required: false, default: "" },
    cdescription: { type: String,required: false, default: "" },
    sort_order: { type: Number, default: false },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('career_heading', headingSchema);