'use strict';

const modelName                 = 'Testimonial';
const Joi                       = require('@hapi/joi');
const { TestimonialModel }      = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');


const create = async (req, res, next) => {
    let testimonial = await FILE_UPLOAD.uploadMultipleFile(req);

    try {
        const schema = Joi.object({
            name: Joi.string().empty(''),
            youtube: Joi.string().empty(''),
            page: Joi.string().empty(''),
            designation: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            description:Joi.string().empty(''),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(testimonial);
        if (error) return res.status(400).json({ error });

        let files = testimonial.files;
        if (files.length) {
            testimonial.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
        } else delete testimonial.files;
  
        testimonial.createdBy = req.user._id;
        testimonial.updatedBy = req.user._id;

        testimonial = new TestimonialModel(testimonial);
        testimonial = await testimonial.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: testimonial
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
        if (query.name) query.name = new RegExp(query.name, "i");
        delete query.pagination;
        delete query.limit;

        let docs = await TestimonialModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('files', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "Testimonial id is required"});
        let testimonial = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().empty(''),
            youtube: Joi.string().empty(''),
            page: Joi.string().empty(''),
            designation: Joi.string().empty(''),
            status: Joi.number().empty(''),
            sort_order: Joi.number().empty(''),
            files: Joi.array(),
            description:Joi.string().empty(''),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (testimonial.files.length) testimonial.files = testimonial.files.map(file => file._id);
        else delete testimonial.files;
        req.body.updatedBy = req.user._id;

        testimonial = await TestimonialModel.updateOne({_id: req.params.id}, {$set: req.body});
        if (!testimonial) return res.status(400).json({error: "Testimonial update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Testimonial updated succesfully"
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

        await TestimonialModel.deleteOne({_id: req.params.id});
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Testimonial Deleted succesfully" 
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