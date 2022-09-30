'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const ChargesSchema = new mongoose.Schema({ 
    name:{type:String, required:true},
    description:{type:String, required:false},
    sort_order: { type: Number, required: false },
    payment: { type: String, required: false },
    files: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('shedule_charge', ChargesSchema);