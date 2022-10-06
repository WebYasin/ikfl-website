'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const PolicyCatSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    description: { type: String, required: false },
    showCustomer: { type: Number, required: false,default:'' },
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('policy_category', PolicyCatSchema);