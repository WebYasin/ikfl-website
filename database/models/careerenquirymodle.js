'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const CareerEnquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String,required: false, default: "" },
    resume: { type: objectId, ref: 'File' },
    jobs: { type: objectId,ref: 'career' },
    state: { type: String,required: false, default: "" },
    city: { type: String, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('career_enquiry', CareerEnquirySchema);