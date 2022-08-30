'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const featureSchema = new mongoose.Schema({ 
    product: { type: objectId, required: true ,ref:'product'},
    title: { type: String, required: false },
    file: { type: objectId, ref: 'File' },
    description: { type: String, required: false},
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('product_feature', featureSchema);