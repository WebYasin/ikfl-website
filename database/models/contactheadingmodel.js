'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const ContactHeadingSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false },
    ntitle: { type: String, required: false },
    nname: { type: String, required: false },
    nphone: { type: String, required: false },
    nemail: { type: String, required: false },
    gtitle: { type: String, required: false }, 
    gname: { type: String, required: false },
    gphone: { type: String, required: false },
    gemail: { type: String, required: false },
    rtitle: { type: String, required: false },
    rdescription: { type: String, required: false },
    file:{type: objectId , ref:'File'},
    status: { type: Number, default: 0 },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('contact_heading', ContactHeadingSchema);