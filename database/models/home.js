'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;


const HomeSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    shortDescription: { type: String,required: false, default : null },
    productHeading: { type: String,required: false, default: "NULL" },
    proudctDescription: { type: String,required: false, default: "" },
    benefitHeading: { type: String,required: false, default: "" },
    benefitDescription: { type: String,required: false, default: "" },   
    partnerHeading: { type: String,required: false, default: "" },
    partnerDescription: { type: String,required: false, default: "" },
    customerHeading: { type: String,required: false, default: "" },
    customerDescription: { type: String,required: false, default: "" },
    mediaHeading: { type: String,required: false, default: "" },
    mediaDescription: { type: String,required: false, default: "" },
    benafitImage: { type: objectId, ref: 'File' },
    testimonialImage: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('home', HomeSchema);