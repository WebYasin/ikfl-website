'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const InformationSchema = new mongoose.Schema({ 
    otitle:{type:String, required:true},
    odescription:{type:String, required:false},
    ctitle:{type:String, required:false},
    cdescription:{type:String, required:false},
    atitle:{type:String, required:false},
    adescription:{type:String, required:false},
    ititle:{type:String, required:false},
    name:{type:String, required:false},
    designation:{type:String, required:false},
    phone:{type:String, required:false},
    email:{type:String, required:false},
    iptitle:{type:String, required:false},
    ipdescription:{type:String, required:false},
    sort_order: { type: Number, required: false },
    file: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('information_heading', InformationSchema);