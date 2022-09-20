'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const TeamSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    designation: { type: String, required: false },
    file: { type: objectId, ref: 'File' },
    description: { type: String, required: false},
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    type: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Team', TeamSchema);