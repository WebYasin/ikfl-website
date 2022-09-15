'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const QuaterlyReportSchema = new mongoose.Schema({ 
    year:{type:objectId, required:true,ref: 'financial_year'},
    name:{type:String, required:true},
    sort_order: { type: Number, required: false },
    status: { type: Number, default: false },
    file: { type: objectId, ref: 'File' },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('quaterly_report', QuaterlyReportSchema);