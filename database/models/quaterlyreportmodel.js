'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const QuaterlyReportSchema = new mongoose.Schema({ 
    year:{type:objectId, required:true,ref: 'financial_year'},
    status: { type: Number, default: false },
    q1: { type: objectId, ref: 'File' },
    q2: { type: objectId, ref: 'File' },
    q3: { type: objectId, ref: 'File' },
    q4: { type: objectId, ref: 'File' },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('quaterly_report', QuaterlyReportSchema);