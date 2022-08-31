'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;
const autoIncrementModelID      = require('./counter');

const CenterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    center_description: { type: String, required: false },
    meta_title:{type: String, required: false},
    meta_description:{type: String, required: false},
    meta_keyword:{type: String, required: false},
    dtitle:{type: String, required: false},
    ddescription:{type: String, required: false},
    imtitle:{type: String, required: false},
    imdescription:{type: String, required: false},
    ctitle:{type: String, required: false},
    cdescription:{type: String, required: false},
    otitle: { type: String, required: false },
    odescription: { type: String, required: false },
    obtn_name: { type: String, required: false },
    obtn_link: { type: String, required: false },

    stitle: { type: String, required: false },
    cttitle: { type: String, required: false },
    ctdescription: { type: String, required: false },
    ltitle: { type: String, required: false },
    ldescription: { type: String, required: false },

    eligibility: { type: String, required: false },
    applyheading: { type: String, required: false },
    lifeinsurance: { type: String, required: false },

    file: { type: objectId, ref: 'File' },
    blog: { type: objectId, ref: 'File' },
   
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('information_center', CenterSchema);