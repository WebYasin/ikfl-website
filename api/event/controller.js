'use strict';

const modelName                     = 'event';
const Joi                           = require('@hapi/joi');
const { EventModel }                 = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD                   = require('@lib/file_upload');

const create = async (req, res, next) => {
    let event = await FILE_UPLOAD.uploadMultipleFile(req);
    event.active = true;
    
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            slug :Joi.string().required(),
            eventDate: Joi.string(),
            files: Joi.array(),
            description: Joi.string(),
            metaTag: Joi.string(),
            metaTitle: Joi.string(),
            metaDescription: Joi.string(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(event);
        if (error) return res.status(400).json({ error });

        let files = event.files;
        if (files.length) {
            event.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
            event.thumbnail = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete event.files;

        event.createdBy = req.user._id;
        event.updatedBy = req.user._id;
        
        event = new EventModel(event);
        event = await event.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: event
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        let query = req.query;
        delete query.pagination;
        delete query.limit;
        let docs = await EventModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('files', 'name original path thumbnail smallFile')
        .populate('thumbnail', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "event id is required" });
        let event = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title: Joi.string().required(),
            eventDate: Joi.string(),
            files: Joi.array(),
            description: Joi.string(),
            metaTag: Joi.string(),
            metaTitle: Joi.string(),
            metaDescription: Joi.string(),
            active: Joi.boolean().required(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(event);
        if (error) return res.status(400).json({ error });

        let files = event.files;
        if (files.length) {
            event.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
            event.thumbnail = files.filter(e => e.fieldName == 'event').map(file => file._id);
        } else delete event.files;

        if(event.files && event.files.length < 1) delete event.files;
        if(event.thumbnail && event.thumbnail.length < 1) delete event.thumbnail;


        event.updatedBy = req.user._id;
       
        let eventData = await EventModel.updateOne({ _id: req.params.id }, {$set: event} );
        if (!eventData) return res.status(400).json({ error: "event update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "event updated succesfully"
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const remove = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });

        const { error } = schema.validate(req.params);
        if (error) return res.status(400).json({ error });

        await EventModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "event Deleted succesfully" 
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    update,
    remove
};