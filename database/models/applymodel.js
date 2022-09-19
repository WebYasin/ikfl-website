'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const ApplySchema = new mongoose.Schema({ 
    firstName: { type: String, required: true },
    LastName: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    addrress: { type: String, required: false },
    state: { type: objectId, ref: "state" },
    city: { type: String, required: false },
    file: { type: objectId, ref: 'File' },
    occupation: { type: String, required: false},
    loanApplied: { type: objectId, ref: "product"},
    active: { type: Boolean, default: true},
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('apply', ApplySchema);