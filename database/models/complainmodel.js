'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;
const moment                    = require('moment');
const autoIncrementModelID      = require('./counter');


const ComplainSchema = new mongoose.Schema({
    loanappid: { type: String, required: false,default:''},
    complainId: { type: String, required: false,default:''},
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    concern: { type: String, required: false },
    type: { type: String, required: true, enum: ['COMPLAINT','QUERY'] },
    address: { type: String, required: false,default:''},
    state: { type: String, required: false,default:''},
    pin: { type: String, required: false,default:''},
    active: { type: Number, default: false },
    status: { type: String, default: false },
    file:{ type: objectId, ref:'File'},
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

ComplainSchema.pre('save', async function (next) {
    const currentTime       = moment().format('YYYYDM');
    if(this.type == "COMPLAINT"){
    this.complainId         = 'C'+currentTime+(await autoIncrementModelID('complain'));
    }else{
    this.complainId         = 'Q'+currentTime+(await autoIncrementModelID('complain'));

    }
    next();
});
module.exports = mongoose.model('complain', ComplainSchema);