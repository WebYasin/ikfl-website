'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const SolutionSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    files: { type: objectId, ref: 'File' },
    slug: { type: String, required: true, default: "" },
    description: { type: String, required: false,default:" " },
    shortDescription:{type: String, required: true,default:" "},
    active: { type: Boolean, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Solution', SolutionSchema);