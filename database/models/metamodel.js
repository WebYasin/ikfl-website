'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const JMetaSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    file: { type: objectId, ref: 'File' },
    title: { type: String, required: false},
    description: { type: String, required: false},
    meta_title: { type: String, required: false},
    meta_description: { type: String, required: false},
    meta_keyword: { type: String, required: false},
    link: { type: String, required: false},
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('meta', JMetaSchema);