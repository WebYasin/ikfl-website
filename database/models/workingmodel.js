'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const WorkingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    file: { type: objectId, ref: 'File' },
    description: { type: String,required: false, default: "" },
    sort_order: { type: Number, default: false },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('workingikfl', WorkingSchema);