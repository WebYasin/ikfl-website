'use strict';

const modelName                 = 'Solution';
const Joi                       = require('@hapi/joi');
const { SolutionModel }         = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');
const FILE_UPLOAD               = require('@lib/file_upload');


const create = async (req, res, next) => {
    let solution = await FILE_UPLOAD.uploadMultipleFile(req);
    solution.active = true;

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            slug: Joi.string().required(),
            active: Joi.boolean().required(),
            files: Joi.array(),
            description:Joi.string(),
            shortDescription:Joi.string(),
            customFields: Joi.object()
        });
    
        const { error } = schema.validate(solution);
        if (error) return res.status(400).json({ error });

        if (solution.files.length) solution.files = solution.files.map(file => file._id);
        else delete solution.files;

        solution.createdBy = req.user._id;
        solution.updatedBy = req.user._id;

        solution = new SolutionModel(solution);
        solution = await solution.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: solution
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

        let docs = await SolutionModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('files', 'name original path thumbnail smallFile');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    
    try {
        if (!req.params.id) return res.status(400).json({error: "solution id is required"});
        let solution = await FILE_UPLOAD.uploadMultipleFile(req);
        const schema = Joi.object({
            name: Joi.string().required(),
            active: Joi.boolean().required(),
            files: Joi.array(),
            description:Joi.string(),
            shortDescription:Joi.string(),
            customFields: Joi.object()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        if (solution.files.length) solution.files = solution.files.map(file => file._id);
        else delete solution.files;
        req.body.updatedBy = req.user._id;

        solution = await SolutionModel.updateOne({_id: req.params.id}, {$set: req.body});
        if (!solution) return res.status(400).json({error: "solution update failed"});
        
        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "solution updated succesfully"
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

        await SolutionModel.deleteOne({_id: req.params.id});
        return res.status(200).send({ result: "solution deleted successfully" });
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