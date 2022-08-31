'use strict';

const modelName                     = 'blog';
const Joi                           = require('@hapi/joi');
const { BlogModel }                 = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');
const FILE_UPLOAD                   = require('@lib/file_upload');

const create = async (req, res, next) => {
    let blog = await FILE_UPLOAD.uploadMultipleFile(req);
    
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            slug :Joi.string().empty(''),
            shortDescription: Joi.string().empty(''),
            show_latest: Joi.number().empty(''),
            files: Joi.array(),
            description: Joi.string().empty(''),
            metaTag: Joi.string().empty(''),
            metaTitle: Joi.string().empty(''),
            metaDescription: Joi.string().empty(''),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(blog);
        if (error) return res.status(400).json({ error });

        let files = blog.files;
        if (files.length) {
            blog.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
            blog.thumbnail = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete blog.files;

        blog.createdBy = req.user._id;
        blog.updatedBy = req.user._id;
        
        blog = new BlogModel(blog);
        blog = await blog.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: blog
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
        let docs = await BlogModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit)
        .populate('files', 'name original path thumbnail smallFile')
        .populate('thumbnail', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "blog id is required" });
        let blog = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            title: Joi.string().required(),
            slug :Joi.string().empty(''),
            shortDescription: Joi.string().empty(''),
            show_latest: Joi.number().empty(''),
            files: Joi.array(),
            description: Joi.string().empty(''),
            metaTag: Joi.string().empty(''),
            metaTitle: Joi.string().empty(''),
            metaDescription: Joi.string().empty(''),
            status: Joi.number(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(blog);
        if (error) return res.status(400).json({ error });

        let files = blog.files;
        if (files.length) {
            blog.files = files.filter(e => e.fieldName == 'file').map(file => file._id);
            blog.thumbnail = files.filter(e => e.fieldName == 'blog').map(file => file._id);
        } else delete blog.files;

        if(blog.files && blog.files.length < 1) delete blog.files;
        if(blog.thumbnail && blog.thumbnail.length < 1) delete blog.thumbnail;


        blog.updatedBy = req.user._id;
       
        let blogData = await BlogModel.updateOne({ _id: req.params.id }, {$set: blog} );
        if (!blogData) return res.status(400).json({ error: "blog update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "blog updated succesfully"
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

        await BlogModel.deleteOne({ _id: req.params.id });
        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "blog Deleted succesfully" 
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