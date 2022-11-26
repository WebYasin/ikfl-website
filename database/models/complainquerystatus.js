'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;
const moment                    = require('moment');
const autoIncrementModelID      = require('./counter');


const ComplainStatusSchema = new mongoose.Schema({

    complainId: { type: String, required: false,default:''},
    comment: { type: String, required: true },
    status: { type: String, default: false },
    active: { type: Boolean, default: true },
    file:{ type: objectId, ref:'File'},
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('complain_status', ComplainStatusSchema);