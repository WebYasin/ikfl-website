'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const ComplainSchema = new mongoose.Schema({
    loanappid: { type: String, required: true},
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    concern: { type: String, required: false },
    active: { type: Number, default: false },
    status: { type: String, default: false },
    file:{ type: objectId, ref:'File'},
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('complain', ComplainSchema);