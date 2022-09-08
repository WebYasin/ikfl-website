'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const FinancialSchema = new mongoose.Schema({ 

    name:{type:String, required:true},
    symbol:{type:String, required:true},
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    file: { type: objectId, ref: 'File' },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('financial_year', FinancialSchema);