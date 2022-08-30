'use strict';

const mongoose                  = require('mongoose');
const uniqueValidator           = require('mongoose-unique-validator');
const objectId                  = mongoose.Schema.Types.ObjectId;

const AttributeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    list: { type: Array, required: false, default: [] },
    category: { type: objectId, ref: 'Category' },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    active: { type: Boolean, required: false }
}, { timestamps: true, versionKey: false });

AttributeSchema.plugin(uniqueValidator, { message: 'Duplicate Entry {PATH}' });

module.exports = mongoose.model('Attribute', AttributeSchema);