'use strict';

const modelName                     = 'Enquiry';
const Joi                           = require('@hapi/joi');
const { EnquiryModel }              = require('@database');
const CONSTANT                      = require('@lib/constant');
const UTILS                         = require('@lib/utils');

const create = async (req, res, next) => {
    let enquiry = req.body || {};
    enquiry.active = true;

    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email().required(),
            product:Joi.string().empty(),
            concern: Joi.string().empty(''),
            active: Joi.boolean()
        });

        const { error } = schema.validate(enquiry);
        if (error) return res.status(400).json({ error });

        enquiry = new EnquiryModel(enquiry);
        enquiry = await enquiry.save();

        return res.status(200).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: enquiry
        });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
}

const get = async (req, res, next) => {
    try {
        const limit = parseInt(req.query && req.query.limit ? req.query.limit : 10);
        const pagination = parseInt(req.query && req.query.pagination ? req.query.pagination : 0);
        // let where = {};
        // if (req.query.id) where._id = req.query.id;
        // else if (req.query.profession_id) where.createdBy = req.query.profession_id;

        let docs = await EnquiryModel.find().sort({createdAt: -1}).limit(limit).skip(pagination*limit) .populate('product', 'name');
        return res.status(200).send({ result: docs });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

const update = async (req, res, next) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: "enquiry id is required" });

        const schema = Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().required(),
            product:Joi.string().empty(),
            email: Joi.string().email().required(),
            concern: Joi.string().required(),
            active: Joi.boolean()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error });

        req.body.updatedBy = req.user._id;
        let enquiry = await EnquiryModel.updateOne({ _id: req.params.id }, { $set: req.body });
        if (!enquiry) return res.status(400).json({ error: "enquiry update failed" });

        return res.status(201).send({
            status: CONSTANT.REQUESTED_CODES.SUCCESS,
            result: "enquiry updated succesfully"
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

        await EnquiryModel.remove({ _id: req.params.id });
        return res.status(200).send({ result: "enquiry deleted successfully" });
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