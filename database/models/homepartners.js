'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const HomePartnerSchema = new mongoose.Schema({ 
    name: { type:String, required:false},
    sort_order: { type: Number, required: false },
    files: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    type: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('partner', HomePartnerSchema);