'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const AddesseSchema = new mongoose.Schema({
    location: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    link: { type: String, required: false, default: '' },
    sort_order: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('contact_addres', AddesseSchema);