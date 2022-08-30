'use strict';

const modelName                     = 'ContactEnquiry';
const Joi                           = require('@hapi/joi');
const { ContactEnquiryModel }       = require('@database');
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
            concern: Joi.string(),
            active: Joi.boolean()
        });

        const { error } = schema.validate(enquiry);
        if (error) return res.status(400).json({ error });

        
        enquiry = new ContactEnquiryModel(enquiry);
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
        let where = {};
        if (req.query.id) where._id = req.query.id;
        else if (req.query.profession_id) where.createdBy = req.query.profession_id;

        let docs = await ContactEnquiryModel.find(where).sort({createdAt: -1}).limit(limit).skip(pagination*limit);
        return res.status(200).send({ result: docs });
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

        await ContactEnquiryModel.remove({ _id: req.params.id });
        return res.status(200).send({ result: "Contact Enquiry deleted successfully" });
    } catch (error) {
        return res.status(400).json(UTILS.errorHandler(error));
    }
};

module.exports = {
    create,
    get,
    remove
};