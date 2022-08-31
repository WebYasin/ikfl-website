'use strict';

const mongoose                  = require('mongoose');
const objectId                  = mongoose.Schema.Types.ObjectId;

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: false, default: "" },
    shortDescription: { type: String, required: false },
    description: { type: String,required: false, default: "" },
    show_latest: { type: Number,required: false, default: 0 },
    files: { type: objectId, ref: 'File' },
    thumbnail: { type: objectId, ref: 'File' },
    metaTag: { type: String,required: false, default: "" },
    metaTitle: { type: String,required: false, default: "" },
    metaDescription: { type: String,required: false, default: "" },
    status: { type: Number, default: false },
    createdBy: { type: objectId, ref: 'User' },
    updatedBy: { type: objectId, ref: 'User' },
    customFields: { type: Object, default: {} }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Blog', BlogSchema);