'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const HomeloadsliderSchema = new mongoose.Schema({ 
    title:{type:String, required:true},
    description:{type:String, required:false},
    sort_order: { type: Number, required: false },
    files: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('loan_slider', HomeloadsliderSchema);