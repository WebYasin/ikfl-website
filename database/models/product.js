'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;
const autoIncrementModelID      = require('./counter');

const FittingInstructionsSchema = new mongoose.Schema({
    _id: false,
    content: { type: String, required: false },
}, { timestamps: true, versionKey: false });

const ApplicationAreasSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, required: false, default: '' },
    files: { type: objectId, ref: 'File' },
}, { timestamps: false, versionKey: false });

const OtherInstructionsSchema = new mongoose.Schema({
    _id: false,
    description: { type: String, required: false, default: '' },
    files: [{ type: objectId, ref: 'File' }],
}, { timestamps: false, versionKey: false });

const SpecificationsSchema = new mongoose.Schema({
    _id: false,
    name: { type: String, required: false, default: '' },
    value: { type: String, required: false, default: '' },
}, { timestamps: false, versionKey: false });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    product_description: { type: String, required: false },
    meta_title:{type: String, required: false},
    meta_description:{type: String, required: false},
    meta_keyword:{type: String, required: false},
    etitle:{type: String, required: false},
    htitle:{type: String, required: false},
    hdescription:{type: String, required: false},
    ltitle:{type: String, required: false},
    ldescription:{type: String, required: false},
    show_home:{type: Number, required: false, default:0},
    slug: { type: String, required: false },
    eligibility: { type: String, required: false },
    applyheading: { type: String, required: false },
    lifeinsurance: { type: String, required: false },

    file: { type: objectId, ref: 'File' },
    blog: { type: objectId, ref: 'File' },
    banner_img: { type: objectId, ref: 'File' },
    eligible_img: { type: objectId, ref: 'File' },
    insurance_img: { type: objectId, ref: 'File' },
    status: { type: Number, default: false },
    sort_order: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('product', ProductSchema);