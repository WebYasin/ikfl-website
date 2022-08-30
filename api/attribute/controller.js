'use strict';

const modelName                 = 'Attribute';
const Joi                       = require('@hapi/joi');
const { AttributeModel }        = require('@database');
const CONSTANT                  = require('@lib/constant');
const UTILS                     = require('@lib/utils');

const create = async (req, res, next) => {
    let attribute = req.body || {};
    attribute.active = true;
    attribute.code = attribute.name.replace(/[^A-Za-z]/g, '');

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            code: Joi.string().required(),
            list: Joi.array().required(),
            category: Joi.string().required(),
            active: Joi.boolean()
        });
    
        const { error } = schema.validate(attribute);
        if (error) return res.status(400).json({ error });

        attribute.createdBy = req.user._id;
        attribute.updatedBy = req.user._id;
        attribute = new AttributeModel(attribute);
        attribute = await attribute.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: attribute
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

        let docs = await AttributeModel.find(query).sort({createdAt: -1}).limit(limit).skip(pagination*limit).populate('category','name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({error: "Attribute id is required"});

        const schema = Joi.object({
            name: Joi.string(),
            list: Joi.array(),
            category: Joi.string(),
            active: Joi.boolean()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        req.body.updatedBy = req.user._id;
        if (req.body.name) req.body.code = req.body.name.replace(/[^A-Za-z]/g, '');
        let attribute = await AttributeModel.updateOne({_id: req.params.id}, {$set: req.body});
        if (!attribute) return res.status(400).json({error: "Attribute update failed"});

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "Attribute updated succesfully"
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

        await AttributeModel.remove({_id: req.params.id});
        return res.status(200).send({ result: "Attribute deleted successfully" });
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